import techLead from './tech-lead.mjs';
import devops from './devops.mjs';
import frontend from './frontend.mjs';
import dataPlatform from './data-platform.mjs';
import content from './content.mjs';
import accessibility from './accessibility.mjs';
import security from './security.mjs';
import qa from './qa.mjs';
import technicalWriter from './technical-writer.mjs';

export const tasks = [
  ...techLead,
  ...devops,
  ...frontend,
  ...dataPlatform,
  ...content,
  ...accessibility,
  ...security,
  ...qa,
  ...technicalWriter
];

export const taskById = Object.fromEntries(tasks.map((task) => [task.id, task]));
