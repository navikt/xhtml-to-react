import fs from 'fs';

const knownRoutes = [
  'pageid.brukeroversikt',
  'pageid.adminoversikt',
  'pageid.lastedataforperson',
  'pageid.etteroppgjorshistorikk',
  'pageid.registrerehenvendelse',
  'pageid.personhistorikk',
  'pageid.familieforhold',
  'pageid.medlemskap',
  'pageid.samordning',
  'pageid.utbetalinger',
  'pageid.skattogtrekk',
  'pageid.belopshistorikk',
  'pageid.selvbetjeningDinPensjon',
  'pageid.selvbetjeningUforetrygd',
  'pageid.landtilknytning',
  'pageid.arbeidsforhold',
  'pageid.pensjonsoversikt',
  'pageid.sakoversikt',
  'pageid.overforesak',
  'pageid.vedtakshistorikk',
  'pageid.kravkontroll',
  'pageid.krav',
  'pageid.familieforholdbarnepensjon',
  'pageid.familieforholdGenerell',
  'pageid.omsorgspoeng',
  'pageid.utenlandsopphold',
  'pageid.registreretrygdetid',
  'pageid.detaljerTrygdeavtale',
  'pageid.inngangeksport',
  'pageid.inngangeksportut',
  'pageid.uforedetaljer',
  'pageid.gjenlevendedetaljer',
  'pageid.barnepensjonsdetaljer',
  'pageid.inntektregister',
  'pageid.forstegangstjeneste',
  'pageid.inntekter',
  'pageid.konverteringsdetaljer',
  'pageid.vilkarsprovingovrig',
  'pageid.vilkarsproving',
  'pageid.beregningkrigoggammelyrkesskade',
  'pageid.beregnetrygdetid',
  'pageid.beregningssammendrag',
  'pageid.attestere',
  'pageid.personopplysninger',
  'pageid.brukerprofil',
  'pageid.institusjonsopphold',
  'pageid.vergepengemottakerSAK2',
  'pageid.vergepengemottakerBRU1',
  'pageid.opptjeningsregister',
  'pageid.grunnlagtrygdetid',
  'pageid.tjenestepensjonsforholdSAK2',
  'pageid.tjenestepensjonsforholdBRU1',
  'pageid.fppberegningafp',
  'pageid.afphistorikk',
  'pageid.klageanke',
  'pageid.vedtakssammendrag',
  'pageid.afpetteroppgjor',
  'pageid.tilbakekrevingsgrunnlag',
  'pageid.tilbakekreving',
  'pageid.oppgaverestanser',
  'pageid.registrereleveattest',
  'pageid.kravrestanser',
  'pageid.uforehistorikk',
  'pageid.simulerUforetrygd',
  'pageid.berortesaker',
  'pageid.fattevedtak',
  'pageid.iverksette',
  'pageid.restpensjonhistorikk',
  'pageid.restbeholdhistorikk',
  'pageid.beholdninghistorikk',
  'pageid.vilkarsvurderingufore',
  'pageid.vilkarsvurderinguforetrygddel1',
  'pageid.vilkarsvurderinguforetrygddel2',
  'pageid.vilkarsvurderinggjenlevendetillegg',
  'pageid.rettskilder',
  'generellfeilside',
  'pageid.testgenerellfeilside',
  'pageid.oppgavelisten',
  'pageid.registrerjournalpost',
  'pageid.inntektsgrenser',
  'pageid.forventedeinntekter',
  'pageid.inntekterfraaordning',
  'pageid.etteroppgjor',
  'pageid.informasjonfraarena',
  'pageid.barnetillegg',
  'pageid.utregning',
  'pageid.ainntekt',
  'pageid.forventedeinntekter',
  'pageid.inntekterfraaordning',
  'pageid.etteroppgjor',
  'pageid.informasjonfraarena',
  'pageid.barnetillegg',
  'pageid.utregning',
  'pageid.ainntekt'
];

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

const messageSource = parsePropertiesFile(fs.readFileSync('../pensjon-psak/psak/src/main/resources/no-nav-pensjon-psak-resources.properties', 'utf8'));

// Go through all the keys in messageSource and find all with the pattern pageid.<something>.<whatever> and remove duplicates.
const pageIds = Object.keys(messageSource).filter(key => key.startsWith('pageid.')).map(key => key.split('.')[1]).filter((value, index, self) => self.indexOf(value) === index);

// Sort alphabetically
pageIds.sort();

// Get an object { id, title, name, modulename, flow } for each pageId
const pages = pageIds.map(pageId => {
  // should be "ok" if the route exists in the knownRoutes array, or "MISSING" if not.
  const status = knownRoutes.includes('pageid.' + pageId) ? 'ok' : 'MISSING';

  const title = messageSource[`pageid.${pageId}.title`];
  const name = messageSource[`pageid.${pageId}.name`];
  const modulename = messageSource[`pageid.${pageId}.modulename`];
  const flow = messageSource[`pageid.${pageId}.flow`];
  const obj = {pageId, status, title, name, modulename, flow};

  /*
  if (!obj.flow) {
    console.warn('No flow found', obj);
  }
   */
  return obj;
});

// Find out if there are several objects in the array with the same value on the "flow" property.
// In that case, log a warning.
const flows = pages.map(page => page.flow).filter((value, index, self) => self.indexOf(value) === index);
flows.forEach(flow => {
  const pagesInFlow = pages.filter(page => page.flow === flow);
  if (pagesInFlow.length > 1) {
    console.warn('More than one page in flow', flow, pagesInFlow);
  }
});
