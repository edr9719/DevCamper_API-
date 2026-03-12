import * as fs from 'fs';
import * as path from 'path';

// ── Helpers ──────────────────────────────────────────────────────────────────

const toPascalCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const toPlural = (str: string): string =>
  str.toLowerCase().endsWith('s') ? str.toLowerCase() : `${str.toLowerCase()}s`;

// ── Templates ────────────────────────────────────────────────────────────────

const modelTemplate = (Name: string): string => `\
import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface
export interface I${Name} extends Document {
  createdAt: Date;
}

// Mongoose schema
const ${Name}Schema = new Schema<I${Name}>(
  {
    // TODO: add your fields here
  },
  { timestamps: true },
);

export const ${Name} = mongoose.model<I${Name}>('${Name}', ${Name}Schema);
`;

const controllerTemplate = (
  Name: string,
  plural: string,
  route: string,
): string => `\
import { Request, Response } from 'express';
import { ${Name} } from '../models/${Name}.model';

//@desc  Get all ${plural}
//@route GET /api/v1/${route}
//@access Public
export const get${Name}s = async (req: Request, res: Response) => {
  try {
    const ${plural} = await ${Name}.find();
    res.status(200).json({
      success: true,
      count: ${plural}.length,
      data: ${plural},
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//@desc  Get single ${Name}
//@route GET /api/v1/${route}/:id
//@access Public
export const getSingle${Name} = async (req: Request, res: Response) => {
  try {
    const ${plural.slice(0, -1)} = await ${Name}.findById(req.params.id);
    if (!${plural.slice(0, -1)}) {
      return res.status(404).json({ success: false, error: '${Name} not found' });
    }
    res.status(200).json({ success: true, data: ${plural.slice(0, -1)} });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//@desc  Create a ${Name}
//@route POST /api/v1/${route}
//@access Private
export const create${Name} = async (req: Request, res: Response) => {
  try {
    const ${plural.slice(0, -1)} = await ${Name}.create(req.body);
    res.status(201).json({ success: true, data: ${plural.slice(0, -1)} });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//@desc  Update a ${Name}
//@route PUT /api/v1/${route}/:id
//@access Private
export const edit${Name} = async (req: Request, res: Response) => {
  try {
    const ${plural.slice(0, -1)} = await ${Name}.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!${plural.slice(0, -1)}) {
      return res.status(404).json({ success: false, error: '${Name} not found' });
    }
    res.status(200).json({ success: true, data: ${plural.slice(0, -1)} });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//@desc  Delete a ${Name}
//@route DELETE /api/v1/${route}/:id
//@access Private
export const delete${Name} = async (req: Request, res: Response) => {
  try {
    const ${plural.slice(0, -1)} = await ${Name}.findByIdAndDelete(req.params.id);
    if (!${plural.slice(0, -1)}) {
      return res.status(404).json({ success: false, error: '${Name} not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
`;

const routeTemplate = (Name: string, plural: string): string => `\
import express, { Router } from 'express';
import {
  get${Name}s,
  getSingle${Name},
  create${Name},
  edit${Name},
  delete${Name},
} from '../controllers/${plural}Controllers';

const router: Router = express.Router();

router.route('/').get(get${Name}s).post(create${Name});

router.route('/:id').get(getSingle${Name}).put(edit${Name}).delete(delete${Name});

export default router;
`;

// ── Main ─────────────────────────────────────────────────────────────────────

const resourceArg = process.argv[2];

if (!resourceArg) {
  console.error('Usage: npm run scaffold <ResourceName>');
  console.error('Example: npm run scaffold course');
  process.exit(1);
}

if (!/^[a-zA-Z]+$/.test(resourceArg)) {
  console.error('Resource name must contain only letters.');
  process.exit(1);
}

const Name = toPascalCase(resourceArg); // e.g.  Course
const plural = toPlural(resourceArg); // e.g.  courses
const route = plural; // e.g.  courses  (used in JSDoc)

const srcDir = path.resolve(__dirname, '..', 'src');

const targets = [
  {
    file: path.join(srcDir, 'models', `${Name}.model.ts`),
    content: modelTemplate(Name),
    label: `model`,
  },
  {
    file: path.join(srcDir, 'controllers', `${plural}Controllers.ts`),
    content: controllerTemplate(Name, plural, route),
    label: `controller`,
  },
  {
    file: path.join(srcDir, 'routes', `${plural}.ts`),
    content: routeTemplate(Name, plural),
    label: `route`,
  },
];

let anySkipped = false;

for (const { file, content, label } of targets) {
  if (fs.existsSync(file)) {
    console.warn(
      `⚠️  Skipped (already exists): ${path.relative(process.cwd(), file)}`,
    );
    anySkipped = true;
    continue;
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅  Created ${label}: ${path.relative(process.cwd(), file)}`);
}

if (!anySkipped) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next step — register the route in src/app.ts:

  import ${plural} from './routes/${plural}';
  app.use('/api/v1/${route}', ${plural});
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}
