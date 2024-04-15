import {expect, test} from 'bun:test';
import {convert} from './convert-ts';

test('should work with outputText', () => {
  expect(
    convert(`
<t:outputText value="#{form.aar invalid EL}"/>
    `),
  ).toBe(`<>{SPEL("#{form.aar invalid EL}")}</>\n`);
});

test('empty outputText', () => {
  expect(
    convert(`
    <t:outputText />
    `),
  ).toBe(`<></>\n`);
});

test('outputText with unicode', () => {
  expect(
    convert(`
    <t:outputText value="#{messageSource['1665.statisktekst.MendelFordeling']}" />
    `,
      {
        messageSource: {
          '1665.statisktekst.MendelFordeling': 'M\u00e9n-del fordeling',
        }
      }
    )).toBe(`<>Mén-del fordeling</>\n`);
});

test('outputText with rendered prop', () => {
  expect(
    convert(`
    <t:outputText value="#{row.enhetNavn}" rendered="#{!row.editable}"/>
    `),
  ).toBe(`{!row.editable && <>{row.enhetNavn}</>}\n`);
});

test('should work with CSS class', () => {
  expect(
    convert(`
<t:outputText value="Test" styleClass="css-class" />
    `),
  ).toBe(`<span className="css-class">Test</span>\n`);
});

test('unicode - æøå', () => {
  expect(
    convert(`
    <h:graphicImage url="/images/icon_play1_16x16.gif" alt="#{messageSource['196.tooltip.Utfor']}" />
    `,
      {
        messageSource: {
          '196.tooltip.Utfor': 'Utf\u00f8r oppgaven'
        }
      }
    )).toBe(`<img src="/psak/images/icon_play1_16x16.gif" alt={"Utfør oppgaven"}/>\n`);
});

test('h: prefix should work with outputText', () => {
  expect(
    convert(`
<h:outputText value="#{form.aar}"/>
    `),
  ).toBe(`<>{form.aar}</>\n`);
});

test('outputText with convertNumber', () => {
  expect(
    convert(`
    <t:outputText value="#{form.sum}">
                  <f:convertNumber pattern="###,###" locale="no" />
                </t:outputText>
    `),
  ).toBe(
    `<>{convertNumber({ pattern: "###,###", locale: "no", value: form.sum })}</>\n`,
  );
});

test('outputText with convertDateTime', () => {
  expect(
    convert(`
<h:outputText value="#{bilag.posteringsDato}" >
  <f:convertDateTime pattern="dd.MM.yyyy" timeZone="CET" />
</h:outputText>
    `),
  ).toBe(
    `<>{convertDateTime({ pattern: "dd.MM.yyyy", timeZone: "CET", value: "#{bilag.posteringsDato}" })}</>\n`,
  );
});

test('outputText with converter', () => {
  expect(
    convert(`
    <t:outputText value="#{form.from}">
        <f:converter converterId="no.stelvio.SomeConverter" />
        <f:attribute name="foo" value="foo-value"/>
        <f:attribute name="bar" value="bar-value"/>
    </t:outputText>
    `),
  ).toBe(
    `<>{convert({ converter: "no.stelvio.SomeConverter", attributes: { "foo": "foo-value", "bar": "bar-value" }, value: form.from })}</>\n`,
  );
});

test('stelvio date converter', () => {
  expect(
    convert(`
    <t:outputText value="#{form.from}">
        <f:converter converterId="no.stelvio.DateConverter" />
        <f:attribute name="pattern" value="#{messageSource['standard.datePattern']}" />
    </t:outputText>
    `),
  ).toBe(
    `<>{formatDate(form.from)}</>\n`,
  );
});

test('stelvio calendar converter', () => {
  expect(
    convert(`
    <t:outputText value="#{form.from}">
        <f:converter converterId="no.stelvio.CalendarConverter" />
    </t:outputText>
    `),
  ).toBe(
    `<>{formatDate(form.from)}</>\n`,
  );
});

test('outputText with converter (shorthand)', () => {
  expect(
    convert(`
    <t:outputText value="#{form.from}" converter="no.stelvio.SomeConverter" />
    `),
  ).toBe(
    `<>{convert({ converter: "no.stelvio.SomeConverter", value: form.from })}</>\n`,
  );
});

test('support plain old HTML', () => {
  expect(
    convert(`
<div>
  <h2 class="header">My title</h2>
  <p>My body</p>
  <h2 class="header">My title 2</h2>
</div>
    `),
  ).toBe(
    `<div><h2 className="header">My title</h2><p>My body</p><h2 className="header">My title 2</h2></div>\n`,
  );
});

test('plain old HTML with rendered attribute', () => {
  expect(
    convert(`
<div rendered="#{form.show}">
 Something
 </div>
     `),
  ).toBe(
    `{form.show && <div>Something</div>}\n`,
  );
});

test('htmlTag', () => {
  expect(
    convert(`
    <t:htmlTag value="div" styleClass="outer">
      <t:htmlTag value="span" styleClass="inner">
        Hello World
      </t:htmlTag>
    </t:htmlTag>
    `),
  ).toBe(
    `<div className="outer"><span className="inner">Hello World</span></div>\n`,
  );
});

test('htmlTag with rendered attribute', () => {
  expect(
    convert(`
    <t:htmlTag value="div" id="test-id" style="width: 100px; height: 200px" styleClass="outer" rendered="#{form.show}">Foo</t:htmlTag>
    `)
  ).toBe(`{form.show && <div id="test-id" style={{ "width": "100px", "height": "200px" }} className="outer">Foo</div>}\n`);
});

test('htmlTag with params', () => {
  expect(
    convert(`
    <t:htmlTag value="div">
      <f:param name="class" value="the-css-class"/>
      Foo
    </t:htmlTag>
    `)
  ).toBe(`<div className="the-css-class">Foo</div>\n`);
})

test('composition: should use a React component', () => {
  expect(
    convert(`
<ui:composition template="/template.xhtml">
  <ui:define name="title">My title</ui:define>
  <ui:define name="body">My body</ui:define>
</ui:composition>
    `),
  ).toBe(`<Template title={"My title"} body={"My body"}/>\n`);
});

test('composition: should use a React component', () => {
  expect(
    convert(`
<ui:composition template="/template.xhtml">
  <ui:define name="title"><div>A</div><div>B</div></ui:define>
</ui:composition>
    `),
  ).toBe(`<Template title={<><div>A</div><div>B</div></>}/>\n`);
});

test('include: should use a React component', () => {
  expect(convert(`<ui:include src="/my-template.xhtml" />`)).toBe(
    `<MyTemplate />\n`,
  );
});

test('include: with params', () => {
  expect(convert(`
<ui:include src="/my-template.xhtml">
  <ui:param name="city" value="Barcelona" />
  <ui:param name="population" value="1620000" />
</ui:include>`)).toBe(
    `<MyTemplate city={"Barcelona"} population={"1620000"}/>\n`
  );
});

test('include with weird src', () => {
  expect(convert(`
  <ui:include src="#{beregningufore}">
    <ui:param name="city" value="Barcelona" />
  </ui:include>
  `)).toBe(`React.createElement("#{beregningufore}", { "city": "Barcelona" })\n`);
});

test('decorate: should use a React component', () => {
  expect(
    convert(`
<ui:decorate template="/template.xhtml">
  <ui:define name="title">My title</ui:define>
  <ui:define name="body">My body</ui:define>
</ui:decorate>
    `),
  ).toBe(`<Template title={"My title"} body={"My body"}/>\n`);
});

test('should generate a React component', () => {
  expect(
    convert(`
<ui:composition>
  <h3>
    <ui:insert name="title"></ui:insert>
  </h3>
  <ui:insert name="body"></ui:insert>
</ui:composition>
    `, {
      messageSource: {},
      addImports: false,
      componentName: 'MyComponentName',
    }),
  ).toBe(
    `export function MyComponentName(props) { return <><h3>{props.title}</h3>{props.body}</>; }\n`,
  );
});

test('Should work with XML document', () => {
  expect(
    convert(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:ui="http://java.sun.com/jsf/facelets"
  xmlns:h="http://java.sun.com/jsf/html"
  xmlns:f="http://java.sun.com/jsf/core"
  xmlns:t="http://myfaces.apache.org/tomahawk"
>
  <ui:composition template="/templates/ramme-skjermbildemal.xhtml">
    <ui:define name="pageContent">
      Hello World
    </ui:define>
  </ui:composition>
</html>
}`),
  ).toBe(`<RammeSkjermbildemal pageContent={"Hello World"}/>\n`);
});

test('ui:composition with weird src', () => {
  expect(convert(`
  <ui:composition template="#{form.kravContext ? '/templates/ramme-skjermbildemal-vilkarsprovingut.xhtml' : '/templates/ramme-skjermbildemal.xhtml'}">
    <ui:define name="pageContent">
        <div>Something</div>
    </ui:define>
  </ui:composition>
  `)).toBe(`<SomeComplicatedComponentName pageContent={<div>Something</div>}/>\n`);
});

test('Nested composition', () => {
  expect(
    convert(`
<ui:composition template="/templates/outer.xhtml">
  <ui:define name="outerContent">
    <ui:composition template="/templates/inner.xhtml">
      <ui:define name="innerContent">
        Hello World
      </ui:define>
    </ui:composition>
  </ui:define>
}
</ui:composition>
    `),
  ).toBe(`<Outer outerContent={<Inner innerContent={"Hello World"}/>}/>\n`);
});

test('NAV tag', () => {
  expect(
    convert(`
    <nav:saveButton foo="bar" />
    `),
  ).toBe(`<SaveButton />\n`);
});

test('SelectOneRow', () => {
  expect(
    convert(`
  <t:selectOneRow />
  `),
  ).toBe(`<div>TODO: implement this manually: t:selectOneRow</div>\n`);
});

test('Data Table', () => {
  expect(
    convert(`
    <t:dataTable
            id="the-id"
            value="#{form.inntektsDetaljer}"
            var="post"
            rowIndexVar="theIndexVar"
            styleClass="the-class-name"
            style="color: red"
            headerClass="the-header-class"
            columnClasses="a, b, c"
            rowClasses="d, e, f"
            rowStyleClass="#{post.rowStyle}"
            footerClass="the-footer-class"
          >
            <t:column>
              <f:facet name="header">
                <span>Foo</span>
              </f:facet>
               <f:facet name="footer">
                Foo Footer
              </f:facet>
              Foo Content
            </t:column>
            <t:column footerstyleClass="alignLeft">
              <f:facet name="header">
                Bar
              </f:facet>
              <f:facet name="footer">
                Bar Footer
              </f:facet>
              Bar Content
            </t:column>
            <f:facet name="header">
                Global header
            </f:facet>
            <f:facet name="footer">
                Global footer
            </f:facet>
          </t:dataTable>
          `),
  ).toBe(
    `<DataTable id="the-id" className="the-class-name" style={{ "color": "red" }} headerClassName="the-header-class" columnClasses="a, b, c" rowClasses="d, e, f" footerClassName="the-footer-class"><thead><tr><th>Global header</th></tr></thead><thead><tr><th className="the-header-class"><span>Foo</span></th><th className="the-header-class">Bar</th></tr></thead><tbody>{form.inntektsDetaljer.map((post, theIndexVar) => <tr className={post.rowStyle}><td className="a">Foo Content</td><td className="b">Bar Content</td></tr>)}</tbody><tfoot><tr><td>Foo Footer</td><td>Bar Footer</td></tr></tfoot><tfoot><tr><td className="the-footer-class" colSpan={9999}>Global footer</td></tr></tfoot></DataTable>\n`,
  );
});

test('PanelGroup, trivial case with just text', () => {
  expect(
    convert(`
    <t:panelGroup>
      <h:outputText value="A" />
    </t:panelGroup>
    `),
  ).toBe(`<>A</>\n`);

})

test('PanelGroup with styleClass', () => {
  expect(
    convert(`
  <t:panelGroup styleClass="noWrap" style="width: 100px; height: 100px;" layout="block">
    <h:outputText value="A" />
    <h:outputText value="B" />
    <h:outputText value="C" />
  </t:panelGroup>
    `),
  ).toBe(`<div className="noWrap" style={{ "width": "100px", "height": "100px" }}><>A</><>B</><>C</></div>\n`);
});

test('PanelGroup with span layout', () => {
  expect(
    convert(`
<t:panelGroup styleClass="css-class">
  <h:outputText value="A" />
  <h:outputText value="B" />
  <h:outputText value="C" />
</t:panelGroup>
  `),
  ).toBe(`<span className="css-class"><>A</><>B</><>C</></span>\n`);
});

test('PanelGroup - simple layout, with rendered prop segfault reproduction', () => {
  expect(
    convert(`
            <h:panelGrid columns="1">
                <h:panelGroup rendered="#{form.showValgtLand}">
                    <ui:insert name="visLandListe"/>
                </h:panelGroup>
            </h:panelGrid>
    `),
  ).toBe(`<PanelGrid columns="1"><PanelGridRow><Panel>{form.showValgtLand && <>{props.visLandListe}</>}</Panel></PanelGridRow></PanelGrid>\n`);
});

test('PanelGrid', () => {
  expect(
    convert(`
    <t:panelGrid columns="2" styleClass="tbl" columnClasses="foo-class, bar-class" rowClasses="row1-class, row2-class">
      <h:outputText value="Foo" />
      <h:outputText value="Bar" />
    </t:panelGrid>
    `),
  ).toBe(`<PanelGrid columns="2" className="tbl" columnClasses="foo-class, bar-class" rowClasses="row1-class, row2-class"><PanelGridRow className="row1-class"><Panel className="foo-class"><>Foo</></Panel><Panel className="bar-class"><>Bar</></Panel></PanelGridRow></PanelGrid>\n`);
});

test('PanelGrid - wrap to several rows', () => {
  expect(
    convert(`
    <t:panelGrid columns="2" styleClass="tbl" columnClasses="foo-class, bar-class" rowClasses="row1-class, row2-class">
      <h:outputText value="A" />
      <h:outputText value="B" />
      <h:outputText value="C" />
      <h:outputText value="D" />
      <h:outputText value="E" />
    </t:panelGrid>
    `),
  ).toBe(`<PanelGrid columns="2" className="tbl" columnClasses="foo-class, bar-class" rowClasses="row1-class, row2-class"><PanelGridRow className="row1-class"><Panel className="foo-class"><>A</></Panel><Panel className="bar-class"><>B</></Panel></PanelGridRow><PanelGridRow className="row2-class"><Panel className="foo-class"><>C</></Panel><Panel className="bar-class"><>D</></Panel></PanelGridRow><PanelGridRow><Panel className="foo-class"><>E</></Panel></PanelGridRow></PanelGrid>\n`);
});

test('PanelGrid, unknown number of columns', () => {
  expect(
    convert(`
    <t:panelGrid columns="#{someCondition ? 4 : 2}" styleClass="tbl" columnClasses="foo-class, bar-class" rowClasses="row1-class, row2-class">
      <h:outputText value="A" />
      <h:outputText value="B" />
      <h:outputText value="C" />
      <h:outputText value="D" />
      <h:outputText value="E" />
    </t:panelGrid>
    `),
  ).toBe(`<DynamicPanelGrid columns="#{someCondition ? 4 : 2}" className="tbl" columnClasses="foo-class, bar-class" rowClasses="row1-class, row2-class"><DynamicPanel><>A</></DynamicPanel><DynamicPanel><>B</></DynamicPanel><DynamicPanel><>C</></DynamicPanel><DynamicPanel><>D</></DynamicPanel><DynamicPanel><>E</></DynamicPanel></DynamicPanelGrid>\n`);
});

test('outputLabel', () => {
  expect(
    convert(`
    <h:outputLabel for="foo" value="#{messageSource['Foo']}" />
    `, {
      messageSource: {
        'Foo': 'Bar',
      }
    }),
  ).toBe(`<label htmlFor="foo">Bar</label>\n`);
});

test('outputLabel with styleClass and children', () => {
  expect(
    convert(`
    <h:outputLabel for="foo" styleClass="hidden">Foo</h:outputLabel>
    `),
  ).toBe(`<label htmlFor="foo" className="hidden">Foo</label>\n`);
});

test('selectOneMenu', async () => {
  expect(
    await convert(`
    <t:selectOneMenu id="foo" value="#{form.foo}">
      <t:selectItem itemLabel="#{messageSource['abc']}" itemValue="foo" />
      <t:selectItem itemLabel="Bar" itemValue="bar" />
      <f:selectItems value="#{form.personList}" />
      <f:ajax listener="#{personopplysningerAction.getFamilieOpplysninger()}" event="change" render="pageFormId" />
    </t:selectOneMenu>
    `, {
      messageSource: {
        'abc': 'ABC',
      }
    }),
  ).toBe(
    `<Select id="foo" value={form.foo}><option value="foo">ABC</option><option value="bar">Bar</option>{form.personList.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</Select>\n`,
  );
});

test('selectOneMenu with a label inside it', () => {
  expect(
    convert(`
    <t:selectOneMenu id="foo" value="#{form.foo}">
      <t:selectItem itemLabel="Bar" itemValue="bar" />
      <f:selectItem itemLabel="Baz" itemValue="baz" />
      <h:outputLabel for="selectedYearId" styleClass="hidden">the label</h:outputLabel>
    </t:selectOneMenu>
    `),
  ).toBe(
    `<><label htmlFor="selectedYearId" className="hidden">the label</label><Select id="foo" value={form.foo}><option value="bar">Bar</option><option value="baz">Baz</option></Select></>\n`,
  );
})

test('selectOneMenu with displayValueOnly', async () => {
  expect(
    await convert(`
    <t:selectOneMenu id="foo" value="#{form.foo}" displayValueOnly="#{something}">
      <t:selectItem itemLabel="Bar" itemValue="bar" />
    </t:selectOneMenu>
    `, {
      messageSource: {
        'abc': 'ABC',
      }
    }),
  ).toBe(
    `<Select id="foo" value={form.foo} displayValueOnly={something}><option value="bar">Bar</option></Select>\n`,
  );
});

test('selectOneRadio', async () => {
  expect(
    await convert(`
    <t:selectOneRadio id="kravStatusFilterId" layout="lineDirection" styleClass="noBorder floatLeft" value="#{form.kravStatusFilter}">
      <f:selectItem id="kravStatusIkkeAvbrutte" itemValue="#{true}" itemLabel="#{messageSource['Foo']}" />
      <f:selectItem id="kravStatusAlle" itemValue="#{false}" itemLabel="#{messageSource['Fox']}" />
      <f:ajax event="change" render="hendelserTableVerticalScroll"/>
    </t:selectOneRadio>
    `, {
      messageSource: {
        'Foo': 'Bar',
        'Fox': 'Dog',
      }
    }),
  ).toBe(
    `<SelectOneRadio id="kravStatusFilterId" layout="lineDirection" className="noBorder floatLeft" value={form.kravStatusFilter}><input type="radio" value={true}></input><input type="radio" value={false}></input></SelectOneRadio>\n`,
  );
});

test('radio', () => {
  expect(
    convert(`
    <t:radio for="sokeType" index="0" />
    `),
  ).toBe(`<input type="radio" name="sokeType" value="0"/>\n`);
});

test('form', () => {
  expect(
    convert(`
    <h:form id="formId" styleClass="formClass">
      Stuff
    </h:form>
    `),
  ).toBe(`<form id="formId" className="formClass">Stuff</form>\n`);
});

test('inputText', () => {
  expect(
    convert(`
    <t:inputText id="foo" value="Enter number" required="true"
    maxlength="100"
style="color:#0033CC; font-weight:bold"
styleClass="inputstyle"
title="Enter the number of your choice."/>
    `),
  ).toBe(
    `<InputText id="foo" value="Enter number" required="true" maxLength="100" style={{ "color": "#0033CC", "fontWeight": "bold" }} className="inputstyle" title="Enter the number of your choice."/>\n`,
  );
});

test('inputText displayValueOnly', () => {
  expect(
    convert(`
    <t:inputText id="foo" value="Bla bla" displayValueOnly="true" />
    `),
  ).toBe(`<InputText id="foo" value="Bla bla" displayValueOnly="true"/>\n`);
});

test('div', () => {
  expect(
    convert(`
    <t:div styleClass="the-css-class">ABC</t:div>
    `),
  ).toBe(`<div className="the-css-class">ABC</div>\n`);
});

test('commandLink', () => {
  expect(
    convert(`
    <t:commandLink action="#{personopplysningerAction.getFamilieOpplysninger()}" value="#{messageSource['Foo']}">More stuff here</t:commandLink>
    `, {
      messageSource: {
        'Foo': 'Bar',
      }
    }),
  ).toBe(
    `<CommandLink onClick={props["#{personopplysningerAction.getFamilieOpplysninger()}"]} value={"Bar"}>More stuff here</CommandLink>\n`,
  );
});

test('commandLink with ajax', () => {
  expect(
    convert(`
    <h:commandLink id="oppgaver-link" style="display:none">
                    <f:ajax event="click" render="oppgaveListeVerticalScroll" listener="#{saksoversiktAction.hentOppgaver}"/>
                </h:commandLink>
    `),
  ).toBe(
    `<CommandLink id="oppgaver-link" style={{ "display": "none" }} onClick={props["#{saksoversiktAction.hentOppgaver}"]}></CommandLink>\n`,
  );
});

test('h:commandLink', () => {
  expect(
    convert(`
    <h:commandLink action="#{personopplysningerAction.getFamilieOpplysninger()}" value="Hent familieopplysninger">More stuff here</h:commandLink>
    `),
  ).toBe(
    `<CommandLink onClick={props["#{personopplysningerAction.getFamilieOpplysninger()}"]} value={"Hent familieopplysninger"}>More stuff here</CommandLink>\n`,
  );
});

test('commandButton', () => {
  expect(
    convert(`
  <t:commandButton rendered="true" id="opprettOppgave" styleClass="btnRight" action="opprettOppgave"
                   value="#{messageSource['Foo']}">
      <t:updateActionListener property="#{flowScope.arenaOppgave}" value="true"/>
      <t:updateActionListener property="#{flowScope.fodselsnummer}" value="#{form.bruker.pid.pid}"/>
  </t:commandButton>
    `, {
      messageSource: {
        'Foo': 'Bar',
        'Fox': 'Dog',
      }
    }),
  ).toBe(
    `<CommandButton id="opprettOppgave" className="btnRight" onClick={props["opprettOppgave"]} value={"Bar"}/>\n`,
  );
});

test('h commandButton', () => {
  expect(
    convert(`
  <h:commandButton id="opprettOppgave" styleClass="btnRight" action="opprettOppgave"
                   value="#{messageSource['Foo']}">
      <t:updateActionListener property="#{flowScope.arenaOppgave}" value="true"/>
      <t:updateActionListener property="#{flowScope.fodselsnummer}" value="#{form.bruker.pid.pid}"/>
  </h:commandButton>
    `, {
      messageSource: {
        'Foo': 'Bar',
      }
    }),
  ).toBe(
    `<CommandButton id="opprettOppgave" className="btnRight" onClick={props["opprettOppgave"]} value={"Bar"}/>\n`,
  );
});

test('updateActionListener', () => {
  expect(
    convert(`
    <t:updateActionListener property="#{flowScope.localPeriodeId}"
                                      value="#{data.periodeId}"/>
`),
  ).toBe(`{/* todo: updateActionListener ${'*'}${'/'}}\n`);
});

test('setPropertyActionListener', () => {
  expect(
    convert(`
    <f:setPropertyActionListener value="#{data.kravId}" target="#{flowScope.localKravId}"/>
    `),
  ).toBe(`{/* todo: setPropertyActionListener ${'*'}${'/'}}\n`);
});

test('image', () => {
  expect(
    convert(`
    <t:graphicImage url="/images/example.gif"
                    alt="#{messageSource['Foo']}"/>
    `, {
      messageSource: {
        'Foo': 'Bar',
      }
    }),
  ).toBe(`<img src="/psak/images/example.gif" alt={"Bar"}/>\n`);
});

test('h image', () => {
  expect(
    convert(`
    <h:graphicImage url="/images/example.gif"
                    alt="alt text"/>
    `),
  ).toBe(`<img src="/psak/images/example.gif" alt={"alt text"}/>\n`);
});

test('outputScript', () => {
  expect(
    convert(`
    <h:outputScript target="body">
            console.log('hello');
        </h:outputScript>
    `),
  ).toBe(`<script>console.log('hello');</script>\n`);
});

test('outputLink', () => {
  expect(
    convert(`
    <h:outputLink value="#"
                  styleClass="imageBtn"
                  onclick="toggleScroll(['pageFormId:hendelserTableVerticalScroll', 'dokumentTableId', 'pageFormId:oppgaveListeVerticalScroll'], ['pageFormId:hendelserTable', 'pageFormId:dokumentTable', 'pageFormId:oppgaveListe'], this, '#{messageSource['saksoversikt.knappetekst.VisAltInnhold']}', '#{messageSource['saksoversikt.knappetekst.TilbakestillVisning']}'); return false;">
        <h:outputText value="#{messageSource['Foo']}"/>
    </h:outputLink>
    `, {
      messageSource: {
        'Foo': 'Bar',
      }
    }),
  ).toBe(
    `<OutputLink href="#" className="imageBtn" onClick={props["toggleScroll(['pageFormId:hendelserTableVerticalScroll', 'dokumentTableId', 'pageFormId:oppgaveListeVerticalScroll'], ['pageFormId:hendelserTable', 'pageFormId:dokumentTable', 'pageFormId:oppgaveListe'], this, '#{messageSource['saksoversikt.knappetekst.VisAltInnhold']}', '#{messageSource['saksoversikt.knappetekst.TilbakestillVisning']}'); return false;"]}><>Bar</></OutputLink>\n`,
  );
});

test('NAV web component', () => {
  expect(
    convert(`
    <wc:some-component />`),
  ).toBe(`<SomeComponent />\n`);
});

test('if condition', () => {
  expect(
    convert(`
    <c:if test="#{!nav:brukNyttDesign()}">
            <div>Hei</div>
        </c:if>
    `),
  ).toBe(`{"#{!nav:brukNyttDesign()}" && <><div>Hei</div></>}\n`);
});

test('if condition segfault reproduction', () => {
  expect(
    convert(`
    <ui:composition template="my-template.xhtml">
        <ui:define name="my-input" >
            <c:if test="#{the.test}">
                content
            </c:if>
        </ui:define>
</ui:composition>
`, {
      messageSource: {},
      addImports: true,
    })).toBe(`import { MyTemplate } from "./MyTemplate";\n<MyTemplate my-input={the.test && <>content</>}/>\n`);
});

test('when condition', () => {
  expect(
    convert(`
    <c:when test="#{!nav:brukNyttDesign()}">
        <div>Hei</div>
    </c:when>
    `),
  ).toBe(`{"#{!nav:brukNyttDesign()}" ? <><div>Hei</div></> : null}\n`);
});

test('choose', () => {
  expect(
    convert(`
    <c:choose>
      <c:when test="A">
        Something A
      </c:when>
      <c:when test="B">
        Something B
      </c:when>
      <c:otherwise>
        Something else
      </c:otherwise>
  </c:choose>
    `)
  ).toBe(`{(function () { if ("A") {
    return <>Something A</>;
}
else if ("B") {
    return <>Something B</>;
}
else {
    return <>Something else</>;
} })()}
`);
});

test('choose with no otherwise', () => {
  expect(
    convert(`
    <c:choose>
      <c:when test="A">
        Something A
      </c:when>
      <c:when test="B">
        Something B
      </c:when>
  </c:choose>
    `)
  ).toBe(`{(function () { if ("A") {
    return <>Something A</>;
}
else if ("B") {
    return <>Something B</>;
} })()}
`);
});

test('boolean checkbox', () => {
  expect(
    convert(`
<t:selectBooleanCheckbox id="the-id" styleClass="the-class-name"
                         value="true">
      <f:ajax event="click" render="vilkarsprovingContainer"
            listener="#{vilkarsprovingAction.changeListener('updateAllResultLists')}"/>
</t:selectBooleanCheckbox>`),
  ).toBe(
    `<input type="checkbox" id="the-id" className="the-class-name" checked="true"/>\n`,
  );
});

test('textarea', () => {
  expect(
    convert(`
      <t:inputTextarea
          id="vurderingInput"
          value="#{form.vurdering}"
          displayValueOnly="#{form.readState}"
          styleClass="txtarea" style="padding: 1px 1px;"
          rows="5"
          cols="100">
      <f:ajax execute="@this" event="blur" disabled="#{form.readState}"/>
    </t:inputTextarea>
    `)).toBe(
    `<Textarea id="vurderingInput" value={form.vurdering} displayValueOnly="#{form.readState}" className="txtarea" style={{ "padding": "1px 1px" }} rows="5" cols="100"></Textarea>\n`,
  );
});

test('input textarea h', () => {
  expect(
    convert(`
    <h:inputTextarea id="begrunnelse" value="foobar" rows="6" cols="100"
                                     styleClass="modalDialogTextArea" onkeyup="enableOkIfEnoughText()"/>
    `),
  ).toBe(
    `<Textarea id="begrunnelse" value="foobar" rows="6" cols="100" className="modalDialogTextArea" onKeyUp="enableOkIfEnoughText()"></Textarea>\n`,
  );
});

test('psak th', () => {
  expect(
    convert(`
    <psak:th value="Something" styleClass="alignLeft"/>
    `),
  ).toBe(`<th className="alignLeft">Something</th>\n`);
});

test('psak td', () => {
  expect(
    convert(`
    <psak:td styleClass="alignLeft" rowspan="3">Something</psak:td>
    `),
  ).toBe(`<td className="alignLeft" rowSpan="3">Something</td>\n`);
});

test('psak phone number', () => {
  expect(
    convert(`
    <psak:phoneNumberOutput id="varselMobildata" isMobileNumber="#{true}" phoneNumber="12345678"/>
    `),
  ).toBe(
    `<PhoneNumberOutput id="varselMobildata" isMobileNumber="#{true}" phoneNumber="12345678"/>\n`,
  );
});

test('ui repeat', () => {
  expect(
    convert(`
      <ui:repeat value="#{form.vedtakList}" var="vedtak">
        <div>#{vedtak}</div>
      </ui:repeat>
    `)
  ).toBe(`{form.vedtakList.map(vedtak => <><div>{vedtak}</div></>)}\n`);
});

test('ui repeat with varStatus', () => {
  expect(
    convert(`
      <ui:repeat value="#{form.vedtakList}" var="vedtak" varStatus="rowStatus">
        <div>#{vedtak}</div>
      </ui:repeat>
    `)
  ).toBe(`{form.vedtakList.map(({ vedtak, rowStatus }) => <><div>{vedtak}</div></>)}\n`);
});

test('ui repeat inside div', () => {
  expect(
    convert(`
    <div>
      <ui:repeat value="#{form.vedtakList}" var="vedtak">
        <div>#{vedtak}</div>
      </ui:repeat>
    </div>
    `)
  ).toBe(`<div>{form.vedtakList.map(vedtak => <><div>{vedtak}</div></>)}</div>\n`);
});

test('ui repeat inside tbody', () => {
  expect(
    convert(`
<tbody>
  <ui:repeat value="#{variable}" var="row">
    <tr>
        Something
    </tr>
  </ui:repeat>
</tbody>
`)).toBe(`<tbody>{variable.map(row => <><tr>Something</tr></>)}</tbody>\n`);
});

test('ui repeat inside define', () => {
  expect(
    convert(`
<ui:decorate template="my-template.xhtml">
    <ui:define name="input">
        <ui:repeat var="item" value="#{items}">
                    Foo
        </ui:repeat>
    </ui:define>
</ui:decorate>
    `)
  ).toBe(`<MyTemplate input={items.map(item => <>Foo</>)}/>\n`);
});

test('outputFormat', () => {
  expect(
    convert(`
      <h:outputFormat value="Insert {0} and {1} here" styleClass="hello">
        <f:param value="A"/>
        <f:param value="B"/>
      </h:outputFormat>
    `)
  ).toBe(`<span className="hello">{format("Insert {0} and {1} here", "A", "B")}</span>\n`);
});

test('format with messageSource', () => {
  expect(
    convert(`
    <h:outputFormat value="#{messageSource['abc.def']}" styleClass="hello">
        <f:param value="A"/>
        <f:param value="B"/>
      </h:outputFormat>
    `, {
      messageSource: {
        'abc.def': 'The translation'
      }
    })
  ).toBe(`<span className="hello">{format("The translation", "A", "B")}</span>\n`);
})

test('outputFormat inside div', () => {
  expect(
    convert(`
    <div>
     <h:outputFormat
      value="#{messageSource['1665.statisktekst.MendelFordeling']}">
     </h:outputFormat>
    </div>
    `, {
      messageSource: {
        '1665.statisktekst.MendelFordeling': 'The translation'
      }
    })
  ).toBe(`<div><span>{format("The translation")}</span></div>\n`);
});

test('verbatim', () => {
  expect(
    convert(`
    <f:verbatim><div>whatever</div><span>something</span></f:verbatim>
    `)
  ).toBe(`<><div>whatever</div><span>something</span></>\n`);
});

test('tree', () => {
  expect(
    convert(`
    <t:tree2>stuff</t:tree2>
    `)
  ).toBe(`<Tree2>TODO Tree2 here</Tree2>\n`);
});

test('remove', () => {
  expect(
    convert(`
    <ui:remove>stuff</ui:remove>
    `)
  ).toBe(`{/* content removed with ui:remove ${'*'}${'/'}}\n`);
});

test('subview', () => {
  expect(
    convert(`
    <f:subview id="subview">Something</f:subview>
    `)
  ).toBe(`<>Something</>\n`);
});

test('ajax', () => {
  expect(
    convert(`
    <f:ajax>
        Some stuff
    </f:ajax>
    `)
  ).toBe(`<>{/* TODO: some <f:ajax> stuff here ${'*'}${'/'}}Some stuff</>\n`);
});

test('button', () => {
  expect(
    convert(`
    <h:button styleClass="systemButton"
          onclick="return false;"
          title="the-title"
          alt="the-alt"
          value="the-value"
          />
    `)
  ).toBe(`<input type="button" className="systemButton" onClick="return false;" title="the-title" alt="the-alt" value="the-value"/>\n`);
});

test('fragment', () => {
  expect(
    convert(`
    <ui:fragment>
      <div>Stuff</div>
    </ui:fragment>
    `)
  ).toBe(`<><div>Stuff</div></>\n`);
});

test('fragment with render prop', () => {
  expect(
    convert(`
    <ui:fragment rendered="thecheck">
      <div>Stuff</div>
    </ui:fragment>
    `)
  ).toBe(`{"thecheck" && <><div>Stuff</div></>}\n`);
});

test('Unexpected facet', () => {
  expect(
    convert(`
    <f:facet name="unexpected">
      This was not expected!
    </f:facet>
    `
    )).toBe(`<UnexpectedFacet name="unexpected">This was not expected!</UnexpectedFacet>\n`);
});

test('Unexpected column', () => {
  expect(
    convert(`
    <h:column>
      This was not expected!
    </h:column>
    `
    )).toBe(`<UnexpectedColumn>This was not expected!</UnexpectedColumn>\n`);
});

test('data list (simple layout)', () => {
  expect(
    convert(`
    <t:dataList styleClass="the-css-class" value="#{form.vedtakList}" var="vedtak" rowIndexVar="theIdx">
      <h:outputText value="#{vedtak}" />
    </t:dataList>
    `
    )).toBe(`<div className="the-css-class">{form.vedtakList.map((vedtak, theIdx) => <><>{vedtak}</></>)}</div>\n`);
});

test('data list (unordered layout)', () => {
  expect(
    convert(`
    <t:dataList styleClass="adresse" value="#{form.adresselinjeList}" var="adresselinje" layout="unorderedList">
        <h:outputText value="#{adresselinje}"/>
    </t:dataList>
    `
    )).toBe(`<ul className="adresse">{form.adresselinjeList.map(adresselinje => <li><>{adresselinje}</></li>)}</ul>\n`);
});

test('translations', () => {
  expect(
    convert(`
    <h:outputText value="#{messageSource['abc.def.ghi']}"/>
    `, {
        messageSource: {
          'abc.def.ghi': 'The Translation'
        }
      }
    )).toBe(`<>The Translation</>\n`);
});

test('reproduce a bug that crashed Prettier', () => {
  expect(
    convert(`
            <ui:decorate template="MyTemplate">
                <ui:define name="prop">
                        <div>
                                <ui:repeat value="#{myList}" var="data">
                                    <ui:repeat value="#{data.ytelseskomponentListe}" var="ytelse" varStatus="ytelseStatus">
                                        <tr>
                                            <td>Stuff</td>
                                        </tr>
                                    </ui:repeat>
                                </ui:repeat>
                            </div>
                </ui:define>
            </ui:decorate>

    `)
  ).toBe(`<MyTemplate prop={<div>{myList.map(data => <>{data.ytelseskomponentListe.map(({ ytelse, ytelseStatus }) => <><tr><td>Stuff</td></tr></>)}</>)}</div>}/>\n`);
});

test('Some weird input XHTML, remove body tag from output', () => {
  expect(
    convert(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:t="http://myfaces.apache.org/tomahawk"
      xmlns:ui="http://java.sun.com/jsf/facelets"
      xml:lang="en" lang="en">

<!--@elvariable id="messageSource" type="java.util.Map"-->
<!--@elvariable id="form" type="no.nav.pensjon.psak.presentation.simulering.uforetrygd.SimulerUforetrygdForm"-->

<head>
    <title>simuleruforetrygd-layout.jsf</title>
</head>
<body>
<ui:composition>
    Hello
</ui:composition>
</body>
</html>
    `)).toBe(`export function MyComponent(props) { return <>Hello</>; }\n`);
});
