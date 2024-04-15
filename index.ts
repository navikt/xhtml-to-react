import fs from 'fs';
import {convert} from './convert-ts';
import {glob} from 'glob';
import * as prettier from 'prettier';

function parsePropertiesFile(input: string): Record<string, string> {
  const lines = input.split('\n').filter(line => line.trim().length > 0 && !line.startsWith('#'));
  const result: Record<string, string> = {};

  function resolveUnicodeEscape(sequence: string): string {
    return sequence.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
  }

  lines.forEach(line => {
    const equalsIndex = line.indexOf('=');
    if (equalsIndex !== -1) {
      const key = resolveUnicodeEscape(line.slice(0, equalsIndex)).trim();
      const value = resolveUnicodeEscape(line.slice(equalsIndex + 1)).trim();
      result[key] = value;
    }
  });

  return result;
}

try {
  const messageSource = parsePropertiesFile(fs.readFileSync('../pensjon-psak/psak/src/main/resources/no-nav-pensjon-psak-resources.properties', 'utf8'));

  const skip = [
    'visjournalpost.xhtml',
    'registrerjournalpost.xhtml',
    'opptjeningsdetaljer.xhtml',
    'opptjeningsendringer.xhtml',
    'ilkarsproving.xhtml',
    // 'vilkarsvurderinguforetrygd-accordionpanel.xhtml',
    'tjenestepensjonsforhold.xhtml', // micro frontend
    'familieforholdpsak2-layout.xhtml', // micro frontend
    'utregning.xhtml', // micro frontend
    'kravkontroll.xhtml', // micro frontend
    'leveattesthistorikk.xhtml', // micro frontend
    'landtilknytning-layout.xhtml', // micro frontend
    'oppgaveoversikt.xhtml', // micro frontend
    'dokumentoversikt.xhtml', // micro frontend
    'brukerprofil.xhtml', // micro frontend
    'pensjonsytelser.xhtml', // micro frontend
    'pensjonssaker.xhtml', // micro frontend
    'opprettsak.xhtml', // micro frontend
    'vergeogpengemottaker.xhtml', // micro frontend
    'overforesak.xhtml', // micro frontend
    'sortColumnHeader.xhtml', // pga er en felleskomponent, greier med f:facet
    'pageingFooterNrScroller.xhtml', // pga er en felleskomponent, greier med f:facet
    'column.xhtml', // pga er en felleskomponent, greier med h:column
    'sortColumn.xhtml', // pga er en felleskomponent, greier med h:column
    'menuSubflow.xhtml', // not working, but let's skip it
  ];
  const files = glob
    .sync(
      '../pensjon-psak/psak/src/main/resources/webapp/pages/**/*.xhtml',
    )
    .filter((file) => !skip.some((skipFile) => file.endsWith(skipFile)));

  const currentDirname = process.cwd();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // also resolve ../../../ etc
    // so if currentDirname is /Users/username/ørojects/scripts
    // then it should resolve to /Users/username/projecs/pesys/etc/etc

    // guess component name: take the file name, strip xhtml, PascalCase it, for example ab-cd-ef should be AbCdEf
    const componentName = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.')).split('-').map((part) => part[0].toUpperCase() + part.substring(1)).join('');

    // const output = currentDirname + '/output';
    const output = currentDirname + '/../storybook-psak/src/generated';

    const outputPath = file.replace('../pensjon-psak/psak/src/main/resources/webapp/pages', output).replace('.xhtml', '.tsx');
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    // make dir recursive
    fs.mkdirSync(outputDir, {recursive: true});

    console.log(`trying to convert (${i + 1}/${files.length})`, file);
    console.log('output to', outputPath);
    const input = fs.readFileSync(file, 'utf8');
    const result = convert(input, {
      messageSource,
      addImports: true,
      componentName
    });

    // const formatted = result;
    const formatted = await prettier.format(result, {semi: true, parser: "babel"});

    fs.writeFileSync(outputPath, formatted);
  }
  console.log('finished');

  /*
  const input = fs.readFileSync('input/medlemskap/medlemskap.xhtml', 'utf8');
// const input = fs.readFileSync('input/personopplysninger.xhtml', 'utf8');

  const result = convert(input);

  const formatted = await prettier.format(result, {semi: true, parser: "babel"});

  console.log(formatted);
   */
} catch (e) {
  console.error('oh no', e);
}
