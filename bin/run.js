#!/usr/bin/env node

(async () => {
  const { execute } = await import('@oclif/core');

 
  const args = process.argv.slice(2);
  const commandProvided = args.length > 0 && !args[0].startsWith('-'); 

  if (!commandProvided) {
 
    process.argv.splice(2, 0, 'analyze');
  }

  await execute({ development: false, dir: import.meta.url });
})();