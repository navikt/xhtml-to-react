import {XMLParser} from 'fast-xml-parser';
import ts from 'typescript';
import convertToReactAttributeName from 'react-attr-converter';
import {fromCSS} from 'react-css';
import htmlTags from 'html-tags';
import {toTypeScript} from "./spel/tsvisitor";

// <desc> from SVG
const allHtmlTags = [...htmlTags, 'desc', 'path', 'font'];

type TextNode = {
  '#text': string;
};
type OutputTextNode = {
  'f:outputText': XmlNode[];
  ':@': {
    '@_value': string;
  };
};

type ParamNode = {
  'f:param': [];
  ':@': {
    '@_name'?: string;
    '@_value': string;
  };
};
type UICompositionNode = {
  'ui:composition': UIDefineNode[];
  ':@': {
    '@_template'?: string;
  };
};
type UIDecorateNode = {
  'ui:decorate': UIDefineNode[];
  ':@': {
    '@_template'?: string;
  };
};
type UIDefineNode = {
  'ui:define': XmlNode[];
  ':@': {
    '@_name': string;
  };
};
type UIInsertNode = {
  'ui:insert': XmlNode[];
  ':@': {
    '@_name': string;
  };
};

type UIIncludeNode = {
  'ui:include': XmlNode[];
  ':@': {
    '@_src': string;
  };
};

type UIParamNode = {
  'ui:param': [];
  ':@': {
    '@_name': string;
    '@_value': string;
  };
}

type UIFragmentNode = {
  'ui:fragment': XmlNode[];
  ':@': {
    '@_rendered'?: string;
  }
}

type UnexpectedFacetNode = {
  'f:facet': XmlNode[];
  ':@': {
    '@_name': string;
  };
}

type UnexpectedColumnNode = {
  'h:column': XmlNode[];
}

type OutputLabelNode = {
  'h:outputLabel': XmlNode[];
  ':@': {
    '@_for': string;
    '@_value': string;
    '@_rendered'?: string;
  };
};

type UIRepeatNode = {
  'ui:repeat': XmlNode[];
  ':@': {
    '@_value': string;
    '@_var': string;
  };
}

type UIRemoveNode = {
  'ui:remove': XmlNode[];
}

type SubviewNode = {
  'f:subview': XmlNode[];
  ':@': {
    '@_id'?: string;
  };
}
type ButtonNode = {
  'h:button': [];
  ':@': {
    '@_styleClass': string;
    '@_onclick': string;
    '@_title': string;
    '@_alt': string;
    '@_value': string;
  };
}
type OutputFormatNode = {
  'h:outputFormat': ParamNode[];
  ':@': {
    '@_value': string;
  };
}

type HtmlNode = { [key: (typeof allHtmlTags)[number]] };

type VerbatimNode = {
  'f:verbatim': XmlNode[];
}

type HtmlTagNode = {
  't:htmlTag': XmlNode[];
  ':@': {
    '@_value': string;
    '@_rendered'?: string;
  };
};

type OutputScriptNode = {
  'h:outputScript': XmlNode[];
  ':@': {};
};

type DataTableNode = {
  't:dataTable': ColumnNode[];
  ':@': {
    '@_styleClass'?: string;
  };
};

type SelectOneRowNode = {
  't:selectOneRow': [];
  ':@': {
    '@_id'?: string;
    '@_value'?: string;
  };
}

type DataListNode = {
  't:dataList': XmlNode[];
  ':@': {
    '@_styleClass'?: string;
    '@_layout'?: string;
    '@_value': string;
    '@_var': string;
  };
}

type HDataTableNode = {
  'h:dataTable': HColumnNode[];
  ':@': {
    '@_styleClass'?: string;
  };
};

type FormNode = {
  'h:form': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_styleClass'?: string;
  };
}

type PanelGroupNode = {
  't:panelGroup': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_layout'?: string;
    '@_styleClass'?: string;
    '@_style'?: string;
  };
};

type PanelGridNode = {
  't:panelGrid': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_styleClass'?: string;
    '@_columns'?: string;
    '@_columnClasses'?: string;
    '@_rowClasses'?: string;
  };
};

type Tree2Node = {
  't:tree2': XmlNode[];
}

type SelectItemNode = {
  't:selectItem': XmlNode[];
  ':@': {
    '@_itemLabel'?: string;
    '@_itemValue'?: string;
  };
};

type SelectItemsNode = {
  'f:selectItems': XmlNode[];
  ':@': {
    '@_value'?: string;
  };
};

type AjaxNode = {
  'f:ajax': XmlNode[];
  ':@': {
    '@_render'?: string;
    '@_execute'?: string;
    '@_listener'?: string;
  };
};

type UpdateActionListenerNode = {
  't:updateActionListener': [];
  ':@': {
    '@_property'?: string;
    '@_value'?: string;
  };
};

type IfNode = {
  'c:if': XmlNode[];
  ':@': {
    '@_test'?: string;
  };
};

type WhenNode = {
  'c:when': XmlNode[];
  ':@': {
    '@_test'?: string;
  };
};

type OtherwiseNode = {
  'c:otherwise': XmlNode[];
}

type ChooseNode = {
  'c:choose': (WhenNode | OtherwiseNode)[];
}

type SetPropertyActionListenerNode = {
  't:setPropertyActionListener': [];
  ':@': {
    '@_value'?: string;
    '@_target'?: string;
  };
};

type SelectOneMenuNode = {
  't:selectOneMenu': (SelectItemsNode | SelectItemNode | AjaxNode)[];
  ':@': {
    '@_id'?: string;
    '@_styleClass'?: string;
    '@_value'?: string;
    '@_rendered'?: string;
  };
};

type SelectOneRadioNode = {
  't:selectOneRadio': (SelectItemsNode | SelectItemNode | AjaxNode)[];
  ':@': {
    '@_id'?: string;
    '@_styleClass'?: string;
    '@_value'?: string;
    '@_rendered'?: string;
    '@_layout'?: string;
  };
};

type RadioNode = {
  't:radio': [],
  ':@': {
    '@_for'?: string;
    '@_index'?: string;
  }
}

type SelectBooleanCheckboxNode = {
  't:selectBooleanCheckbox': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_styleClass'?: string;
    '@_value'?: string;
  };
};

type InputTextNode = {
  't:inputText': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_value'?: string;
    '@_rendered'?: string;
    '@_styleClass'?: string;
    '@_required'?: string;
    '@_displayValueOnly'?: string;
  };
};

type HInputTextNode = {
  'h:inputText': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_value'?: string;
    '@_rendered'?: string;
    '@_styleClass'?: string;
    '@_required'?: string;
    '@_displayValueOnly'?: string;
  };
};

type InputTextareaNode = {
  't:inputTextarea': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_value'?: string;
    '@_styleClass'?: string;
    '@_style'?: string;
    '@_rows'?: string;
    '@_cols'?: string;
    '@_onkeyup'?: string;
  };
};

type HInputTextareaNode = {
  'h:inputTextarea': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_value'?: string;
    '@_styleClass'?: string;
    '@_style'?: string;
    '@_rows'?: string;
    '@_cols'?: string;
    '@_onkeyup'?: string;
  };
};

type CommandLinkNode = {
  't:commandLink': XmlNode[];
  ':@': {
    '@_value'?: string;
  };
};

type CommandButtonNode = {
  't:commandButton': XmlNode[];
  ':@': {
    '@_value'?: string;
  };
};

type OutputLinkNode = {
  'h:outputLink': XmlNode[];
  ':@': {
    '@_value'?: string;
    '@_styleClass'?: string;
    '@_onclick'?: string;
  };
};

type GraphicImageNode = {
  't:graphicImage': [];
  ':@': {
    '@_url'?: string;
    '@_alt'?: string;
  };
};

type NavTagNode = {
  [`nav:{string}`]: XmlNode[];
};

type NavWebComponentNode = {
  [`wc:{string}`]: XmlNode[];
};

type PsakTHNode = {
  'psak:th': [];
  ':@': {
    '@_value'?: string;
  };
}

type PsakTDNode = {
  'psak:td': XmlNode[];
  ':@': {
    '@_rowspan'?: string;
  };
}

type PsakPhoneNumberOutputNode = {
  'psak:phoneNumberOutput': XmlNode[];
  ':@': {
    '@_id'?: string;
    '@_isMobileNumber'?: string;
    '@_phoneNumber'?: string;
  };
}

type DivNode = {
  't:div': XmlNode[];
  ':@': {
    '@_styleClass'?: string;
  };
};

type ColumnNode = {
  't:column': XmlNode[];
  ':@': {
    '@_styleClass'?: string;
  };
};

type HColumnNode = {
  'h:column': XmlNode[];
  ':@': {
    '@_styleClass'?: string;
  };
};

type ConvertNumberNode = {
  'f:convertNumber': XmlNode[];
  ':@': {
    '@_pattern'?: string;
    '@_locale'?: string;
  };
};

type ConverterNode = {
  'f:converter': XmlNode[];
  ':@': {
    '@_converterId'?: string;
  };
};

type ConvertDateTimeNode = {
  'f:convertDateTime': [];
  ':@': {
    '@_pattern'?: string;
    '@_timeZone'?: string;
  };
}

type AttributeNode = {
  'f:attribute': [];
  ':@': {
    '@_name'?: string;
    '@_value'?: string;
  };
};

type XmlNode =
  | TextNode
  | OutputTextNode
  | OutputLinkNode
  | ConvertNumberNode
  | ConverterNode
  | AttributeNode
  | UICompositionNode
  | UIDecorateNode
  | UIDefineNode
  | UIIncludeNode
  | OutputLabelNode
  | UIRepeatNode
  | OutputFormatNode
  | CommandLinkNode
  | CommandButtonNode
  | DataTableNode
  | PanelGroupNode
  | PanelGridNode
  | SelectOneMenuNode
  | SelectOneRadioNode
  | AjaxNode
  | UpdateActionListenerNode
  | IfNode
  | WhenNode
  | GraphicImageNode
  | NavTagNode
  | NavWebComponentNode
  | DivNode
  | HtmlTagNode
  | OutputScriptNode
  | HtmlNode;

type Options = {
  messageSource: Record<String, String>;
  addImports: boolean;
  componentName?: string;
}
const defaultOptions = {
  messageSource: {},
  addImports: false,
  componentName: undefined,
}

// , and the input must not have any non-integer characters.
function isInteger(input: string): boolean {
  return /^\d+$/.test(input);
}

// It must be an integer
function enforceInteger(input: string): number {
  if (!isInteger(input)) {
    throw new Error('Expected integer, got ' + input);
  }
  return parseInt(input, 10);
}

function numericValue(value: number) {
  return ts.factory.createJsxText('{' + value + '}')
}

function spelOrStringLiteral(input: string, jsxExpressionIfNeeded: boolean) {
  // replace &lt; with < and &gt; with > in input
  input = input.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  let inputAst;
  try {
    inputAst = toTypeScript(input);
    if (jsxExpressionIfNeeded && !ts.isStringLiteral(inputAst)) {
      inputAst = ts.factory.createJsxExpression(undefined, inputAst);
    }
  } catch (err) {
    console.error('Could not parse SPEL: ' + input, err);
    inputAst = ts.factory.createStringLiteral(input);
  }
  return inputAst;
}

export function convert(input: string, options: Partial<Options> = defaultOptions): string {
  const opts = {
    ...defaultOptions,
    ...options
  };
  const parser = new XMLParser({
    ignoreAttributes: false,
    // isArray: () => true,
    preserveOrder: true,
  });
  const json: XmlNode[] = parser.parse(input);

  const visitor = new Visitor(opts);
  visitor.visitAll(json);
  let ast = [visitor.result];

  if (opts.addImports) {
    const imports = Object.entries(visitor.imports).map(([path, components]) => {
      return ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          false,
          ts.factory.createNamedImports(
            components.map((component) => {
              return ts.factory.createImportSpecifier(
                false,
                undefined,
                ts.factory.createIdentifier(component),
              );
            }),
          ),
        ),
        ts.factory.createStringLiteral(path),
      );
    });
    ast = [...imports, ...ast]
  }
  const warnings = visitor.warnings.map(warning => ts.factory.createJSDocComment(warning));
  ast = [...warnings, ...ast];

  const finished = ts.factory.createSourceFile(ast, ts.factory.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.None);

  const resultFile = ts.createSourceFile(
    'someFileName.ts',
    '',
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
  let result = printer.printNode(ts.EmitHint.Unspecified, finished, resultFile);

  // Replace unicode escaping with the actual character
  // For example: \u00E9 -> é
  result = result.replace(/\\u([\d\w]{4})/gi, (_, grp) => String.fromCharCode(parseInt(grp, 16)));

  return result;
}

class Visitor {
  result: any;
  componentParams: any[];
  stringShouldBeJSX: boolean;
  expressionShouldNotBeWrappedInJSX: boolean;
  options: Options;
  imports: { [path: string]: string[] };
  warnings: string[];

  constructor(options: Options) {
    this.result = undefined;
    this.componentParams = [];
    this.stringShouldBeJSX = false;
    this.expressionShouldNotBeWrappedInJSX = false;
    this.options = options;
    this.imports = {};
    this.warnings = [];
  }

  addImport(component: string, path: string) {
    this.imports[path] = this.imports[path] ?? [];
    if (!this.imports[path].includes(component)) {
      this.imports[path].push(component);
    }
  }

  addWarning(warning: string) {
    this.warnings.push(warning);
    console.warn('WARN: ' + warning);
  }

  cssStringToReact(style: string) {
    try {
      return fromCSS('{' + style + ' }');
    } catch (err) {
      this.addWarning('Cannot parse CSS style: ' + err);
      return {
        'data-css-error': 'Cannot parse CSS style',
        'data-invalid-css': style,
      }
    }
  }

  makeStyleJsxAttribute(parsedStyle: Record<string, string>) {
    return ts.factory.createJsxAttribute(
      ts.factory.createIdentifier('style'),
      ts.factory.createJsxExpression(
        undefined,
        ts.factory.createObjectLiteralExpression(
          Object.entries(parsedStyle).map(([key, value]) => {
            return ts.factory.createPropertyAssignment(
              ts.factory.createStringLiteral(key),
              ts.factory.createStringLiteral(value),
            );
          }),
        ),
      ),
    );
  }

  visit(node: XmlNode) {
    if ('html' in node) {
      this.visitAll(node.html);
    } else if ('?xml' in node) {
      // skip
    } else if ('#text' in node) {
      this.visitText(node);
    } else if ('t:outputText' in node) {
      this.visitOutputText(node);
    } else if ('h:outputText' in node) {
      this.visitOutputText(node);
    } else if ('ui:composition' in node) {
      this.visitUIComposition(node);
    } else if ('ui:decorate' in node) {
      this.visitUIDecorate(node);
    } else if ('ui:insert' in node) {
      this.visitUIInsert(node);
    } else if ('ui:include' in node) {
      this.visitUIInclude(node);
    } else if (allHtmlTags.some((tag) => tag in node)) {
      this.visitHtmlNode(node as HtmlNode);
    } else if ('t:htmlTag' in node) {
      this.visitHtmlTagNode(node);
    } else if ('h:outputScript' in node) {
      this.visitOutputScript(node);
    } else if ('t:dataTable' in node || 'h:dataTable' in node) {
      this.visitDataTable(node);
    } else if ('t:selectOneRow' in node) {
      this.visitSelectOneRow(node);
    } else if ('t:dataList' in node) {
      this.visitDataList(node);
    } else if ('h:form' in node) {
      this.visitForm(node);
    } else if ('c:if' in node) {
      this.visitIf(node);
    } else if ('c:when' in node) {
      this.visitWhen(node);
    } else if ('c:choose' in node) {
      this.visitChoose(node);
    } else if ('t:updateActionListener' in node) {
      this.visitUpdateActionListener(node);
    } else if ('f:setPropertyActionListener' in node) {
      this.visitSetPropertyActionListener(node);
    } else if ('ui:fragment' in node) {
      this.visitUIFragment(node);
    } else if ('f:facet' in node) {
      this.visitUnexpectedFacet(node);
    } else if ('h:column' in node || 't:column' in node) {
      this.visitUnexpectedColumn(node);
    } else if ('h:outputLabel' in node) {
      this.visitOutputLabel(node);
    } else if ('ui:repeat' in node) {
      this.visitUIRepeat(node);
    } else if ('ui:remove' in node) {
      this.visitUIRemove(node);
    } else if ('f:subview' in node) {
      this.visitSubview(node);
    } else if ('h:button' in node) {
      this.visitButton(node);
    } else if ('h:outputFormat' in node) {
      this.visitOutputFormat(node);
    } else if ('f:verbatim' in node) {
      this.visitVerbatim(node);
    } else if ('t:panelGroup' in node || 'h:panelGroup' in node) {
      this.visitPanelGroup(node);
    } else if ('t:panelGrid' in node || 'h:panelGrid' in node) {
      this.visitPanelGrid(node);
    } else if ('t:tree2' in node) {
      this.visitTree2(node);
    } else if ('t:selectOneMenu' in node || 'h:selectOneMenu' in node) {
      this.visitSelectOneMenu(node);
    } else if ('t:selectOneRadio' in node || 'h:selectOneRadio' in node) {
      this.visitSelectOneRadio(node);
    } else if ('t:radio' in node) {
      this.visitRadio(node);
    } else if ('f:ajax' in node) {
      this.visitAjax(node);
    } else if ('t:selectBooleanCheckbox' in node || 'h:selectBooleanCheckbox' in node) {
      this.visitSelectBooleanCheckbox(node);
    } else if ('t:inputText' in node || 'h:inputText' in node) {
      this.visitInputText(node);
    } else if ('t:inputTextarea' in node || 'h:inputTextarea' in node) {
      this.visitInputTextarea(node);
    } else if ('t:commandLink' in node) {
      this.visitCommandLink(node);
    } else if ('h:commandLink' in node) {
      this.visitCommandLink(node);
    } else if ('t:commandButton' in node) {
      this.visitCommandButton(node);
    } else if ('h:commandButton' in node) {
      this.visitCommandButton(node);
    } else if ('h:outputLink' in node) {
      this.visitOutputLink(node);
    } else if ('f:param' in node) {
      this.visitParam(node);
    } else if ('t:graphicImage' in node) {
      this.visitGraphicImage(node);
    } else if ('h:graphicImage' in node) {
      this.visitGraphicImage(node);
    } else if (Object.keys(node).some((key) => key.startsWith('nav:'))) {
      this.visitNavNode(node as NavTagNode);
    } else if ('psak:th' in node) {
      this.visitPsakTHNode(node as PsakTHNode);
    } else if ('psak:td' in node) {
      this.visitPsakTDNode(node as PsakTDNode);
    } else if ('psak:phoneNumberOutput' in node) {
      this.visitPsakPhoneNumberOutputNode(node);
    } else if (Object.keys(node).some((key) => key.startsWith('wc:'))) {
      this.visitNavWCNode(node as NavWebComponentNode);
    } else if ('t:div' in node) {
      this.visitDiv(node as DivNode);
    } else if ('h:inputHidden' in node) {
      this.addWarning('h:inputHidden is not implemented in the migration script.');
    } else if ('h:outputStylesheet' in node) {
      this.addWarning('h:outputStylesheet is not implemented in the migration script.');
    } else {
      throw new Error('Unknown node: ' + JSON.stringify(node));
    }
  }

  visitAll(nodes: XmlNode[]) {
    for (const node of nodes) {
      this.visit(node);
    }
  }

  visitText(node: TextNode) {
    this.result = this.handleText(node['#text']);
  }

  handleRenderedProp(expression: string) {
    if (expression !== undefined && expression !== 'true') {
      let ast;
      try {
        ast = toTypeScript(expression);
      } catch (err) {
        console.warn('could not parse SPEL for ' + expression, err);
        ast = ts.factory.createStringLiteral(expression);
      }

      // Generate a JSX expression with an AND expression based on this.result:
      // {expression && the-result-here}
      // For example:
      // {props.rendered && <div>...</div>}
      this.result = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createBinaryExpression(
          ast,
          ts.factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
          this.result,
        ),
      );
    }
  }

  handleText(input: string | undefined, isAttribute = false) {
    if (input === undefined) {
      return undefined;
    }

    let text = input;
    // Replace all matches of the above regex with this.options.messageSource['the-key']
    // For example
    // { 'the-key': 'the-value' }
    // #{messageSource['the-key']} -> the-value
    const matchMessageSource = /#\{messageSource\['(.+?)'\]}/g;
    text = text.replace(matchMessageSource, (_, key) => {
      return this.options.messageSource[key] ?? `messageSource['${key}'] is MISSING`;
    });

    // Replace unicode escaping with the actual character
    // For example: \u00E9 -> é
    text = text.replace(/\\u([\d\w]{4})/gi, (_, grp) => String.fromCharCode(parseInt(grp, 16)));

    // Replace &#160; with &nbsp;
    text = text.replace(/&#160;/g, '&nbsp;');

    if (isAttribute) {
      return ts.factory.createJsxExpression(undefined, ts.factory.createStringLiteral(text));
    }

    if (this.stringShouldBeJSX) {
      if (text.indexOf('#{') !== -1 || text.indexOf('${') !== -1) {
        let ast;
        try {
          ast = toTypeScript(text);
        } catch (err) {
          console.warn('could not parse SPEL for ' + text, err);
          ast = ts.factory.createCallExpression(
            ts.factory.createIdentifier('SPEL'),
            undefined,
            [ts.factory.createStringLiteral(text)],
          );
        }

        // create a jsx expression with a calling a function called SPEL in it
        // for example #{foobar} -> {SPEL("foobar")}
        return ts.factory.createJsxExpression(
          undefined,
          ast
        );
      } else {
        // If it includes { } < > then wrap it in jsx expression and string literal
        if (text.match(/[{}<>]/)) {
          if (this.expressionShouldNotBeWrappedInJSX) {
            return ts.factory.createStringLiteral(text);
          } else {
            return ts.factory.createJsxExpression(
              undefined,
              ts.factory.createStringLiteral(text),
            );
          }
        } else {
          return ts.factory.createJsxText(text);
        }
      }
    } else {
      return ts.factory.createStringLiteral(text);
    }
  }

  visitUIComposition(node: UICompositionNode) {
    if (':@' in node && '@_template' in node[':@']) {
      this.visitComponent(node);
    } else {
      this.visitTemplate(node);
    }
  }

  visitUIDecorate(node: UIDecorateNode) {
    if (':@' in node && '@_template' in node[':@']) {
      this.visitComponent(node);
    } else {
      this.visitTemplate(node);
    }
  }

  visitUIDefine(node: UIDefineNode) {

    const name = node[':@']['@_name'];

    const children = [];
    for (const child of node['ui:define']) {
      this.visit(child);
      children.push(this.result);
    }

    let res;
    if (children.length === 1) {
      // Check if result is a JsxExpression
      res = ts.isJsxExpression(this.result) ? this.result : ts.factory.createJsxExpression(undefined, this.result);
    } else {
      // several children, so wrap them in a jsx fragment inside a jsx expression
      res = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createJsxFragment(
          ts.factory.createJsxOpeningFragment(),
          children,
          ts.factory.createJsxJsxClosingFragment(),
        ),
      );
    }

    this.componentParams.push({
      name,
      result: res,
    });

  }

  visitUIInsert(node: UIInsertNode) {
    const name = node[':@']?.['@_name'] ?? 'insert-everything';
    this.result = ts.factory.createJsxExpression(
      undefined,
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier('props'),
        name,
      ),
    );
  }

  visitUIInclude(node: UIIncludeNode) {
    const src = node[':@']['@_src'];
    const name = src
      .split('/')
      .pop()
      .replace('.xhtml', '')
      .replace(/(?:^|-)(.)/g, (_, x) => x.toUpperCase());

    // if the name is just A-Za-z
    const isSimpleName = /^[A-Za-z]+$/.test(name);

    const attributes = [];
    for (const child of node['ui:include']) {
      if ('ui:param' in child) {
        const name = child[':@']['@_name'];
        const value = child[':@']['@_value'];

        if (isSimpleName) {
          attributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier(name),
              ts.factory.createJsxExpression(undefined, ts.factory.createStringLiteral(value)),
            ),
          );
        } else {
          attributes.push(
            ts.factory.createPropertyAssignment(
              ts.factory.createStringLiteral(name),
              ts.factory.createStringLiteral(value),
            ),
          );
        }
      } else {
        throw new Error('Unexpected code: expected <ui:param> inside <ui:include>');
      }
    }

    if (isSimpleName) {
      this.result = ts.factory.createJsxSelfClosingElement(
        ts.factory.createIdentifier(name),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      );
    } else {
      // Do React.createElement(name, attributes, children) instead
      this.result = ts.factory.createCallExpression(
        ts.factory.createIdentifier('React.createElement'),
        undefined,
        [
          ts.factory.createStringLiteral(name),
          ts.factory.createObjectLiteralExpression(attributes),
        ],
      );
    }
  }

  visitComponent(node: UICompositionNode | UIDecorateNode) {
    this.componentParams = [];
    (node['ui:composition'] ?? []).map((child) => {
      if ('ui:define' in child) {
        this.visitUIDefine(child);
      }
    });
    (node['ui:decorate'] ?? []).map((child) => {
      if ('ui:define' in child) {
        this.visitUIDefine(child);
      }
    });

    const template = node[':@']['@_template'];
    // Use the last part of the path, remove xhtml extension, capitalize, camelcase
    // for example: /a/b/c/foo-bar.xml -> FooBar
    // (Thank you, GitHub Copilot)
    let name = template
      .split('/')
      .pop()
      .replace('.xhtml', '')
      .replace(/(?:^|-)(.)/g, (_, x) => x.toUpperCase());

    this.addImport(name, './' + name);

    // if the name is just A-Za-z
    const isSimpleName = /^[A-Za-z]+$/.test(name);

    if (!isSimpleName) {
      name = 'SomeComplicatedComponentName'
    }

    const props = this.componentParams.map((param) => {
      return ts.factory.createJsxAttribute(
        ts.factory.createIdentifier(param.name),
        param.result
      );
    });


    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(name),
      undefined,
      ts.factory.createJsxAttributes(props),
    );
    this.componentParams = [];


  }

  visitTemplate(node: UICompositionNode | UIDecorateNode) {
    const children = [];
    for (const child of node['ui:composition']) {
      this.visit(child);
      children.push(this.result);
    }

    this.result = ts.factory.createFunctionDeclaration(
      [
        // export it
        ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
      ],
      undefined,
      ts.factory.createIdentifier(this.options.componentName ?? 'MyComponent'),
      undefined,
      [ts.factory.createParameterDeclaration(undefined, undefined, 'props')],
      undefined,
      ts.factory.createBlock([
        ts.factory.createReturnStatement(
          ts.factory.createJsxFragment(
            ts.factory.createJsxOpeningFragment(),
            children,
            ts.factory.createJsxJsxClosingFragment(),
          ),
        ),
      ]),
    );
  }

  visitOutputText(node: OutputTextNode) {
    let text;
    let rendered;
    let converter;

    const attributes = [];

    // First, gather all converter attributes
    const converterAttributes = [];
    const converterAttributesAsMap = {};
    const children = (node['t:outputText'] ?? node['h:outputText']);
    for (const child of children) {
      if ('f:attribute' in child) {
        const name = child[':@']?.['@_name'];
        const value = child[':@']?.['@_value'];

        converterAttributesAsMap[name] = value;
        converterAttributes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(name),
            ts.factory.createStringLiteral(value),
          ),
        );
      }
    }

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_value') {
        continue; // this is handled already
      } else if (key === '@_rendered') {
        rendered = value;
      } else if (key === '@_disabled') {
        // unknown attribute
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-disabled'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        const style = this.cssStringToReact(value);
        if (Object.keys(style).length > 0) {
          attributes.push(this.makeStyleJsxAttribute(style));
        }
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_for') {
        // Unknown
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-for'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_class') {
        // This technically isn't allowed in outputText; but let's treat it like styleClass.
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_escape') {
        // ignore this for now. We would need something like dangerouslySetInnerHTML.
      } else if (key === '@_converter') {
        converter = value;
      } else if (key === '@_alt') {
        this.addWarning('alt attribute is not supposed to be used on outputText.');
      } else {
        throw new Error('Unexpected attribute in outputText: ' + key);
      }
    }

    this.withStringShouldBeJSX(() => {
      text = this.handleText(node[':@']?.['@_value'] ?? '');
    });

    // const text = ts.factory.createJsxText(node[':@']['@_value']);

    let expr: any = text;

    if (converter === 'no.stelvio.CalendarConverter') {
      this.addImport('formatDate', '@common/utils');
      expr = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('formatDate'),
          undefined,
          [
            spelOrStringLiteral(node[':@']['@_value'] ?? ''),
          ],
        ),
      );
    } else if (converter === 'no.stelvio.DateConverter' && converterAttributesAsMap['pattern'] === '#{messageSource[\'standard.datePattern\']}') {
      this.addImport('formatDate', '@common/utils');
      expr = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('formatDate'),
          undefined,
          [
            spelOrStringLiteral(node[':@']['@_value'] ?? ''),
          ],
        ),
      );
    } else if (converter !== undefined) {
      expr =
        ts.factory.createJsxExpression(
          undefined,
          ts.factory.createCallExpression(
            ts.factory.createIdentifier('convert'),
            undefined,
            [
              ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment(
                  'converter',
                  ts.factory.createStringLiteral(converter),
                ),
                ts.factory.createPropertyAssignment(
                  'value',
                  spelOrStringLiteral(node[':@']['@_value'] ?? ''),
                ),
              ]),
            ],
          )
        );
    }

    for (const child of children) {
      for (const [key, value] of Object.entries(child)) {
        if (key === ':@') {
          continue;
        } else if (key === 'f:attribute') {
          // We've already done those above
          continue;
        } else if (key === 'f:convertNumber') {
          // convertNumber({ pattern: "###,###", locale: "no", value: "#{form.sum}" })
          expr = ts.factory.createJsxExpression(
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier('convertNumber'),
              undefined,
              [
                ts.factory.createObjectLiteralExpression([
                  ts.factory.createPropertyAssignment(
                    'pattern',
                    ts.factory.createStringLiteral(
                      child[':@']['@_pattern'] ?? '',
                    ),
                  ),
                  ts.factory.createPropertyAssignment(
                    'locale',
                    ts.factory.createStringLiteral(
                      child[':@']['@_locale'] ?? '',
                    ),
                  ),
                  ts.factory.createPropertyAssignment(
                    'value',
                    spelOrStringLiteral(node[':@']['@_value'] ?? ''),
                  ),
                ]),
              ],
            ),
          );
        } else if (key === 'f:converter') {
          const converterId = child[':@']['@_converterId'];
          // should be convert({ converter: "the-converter-id", value: "the-value" })

          const attrs = [];
          attrs.push(
            ts.factory.createPropertyAssignment(
              'converter',
              ts.factory.createStringLiteral(converterId ?? ''),
            ),
          );

          if (converterAttributes.length > 0) {
            attrs.push(
              ts.factory.createPropertyAssignment(
                'attributes',
                ts.factory.createObjectLiteralExpression(converterAttributes),
              ),
            );
          }

          attrs.push(
            ts.factory.createPropertyAssignment(
              'value',
              spelOrStringLiteral(node[':@']['@_value'] ?? ''),
            ),
          );

          if (converterId === 'no.stelvio.CalendarConverter') {
            this.addImport('formatDate', '@common/utils');
            expr = ts.factory.createJsxExpression(
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('formatDate'),
                undefined,
                [
                  spelOrStringLiteral(node[':@']['@_value'] ?? ''),
                ],
              ),
            );
          } else if (converterId === 'no.stelvio.DateConverter' && converterAttributesAsMap['pattern'] === '#{messageSource[\'standard.datePattern\']}') {
            this.addImport('formatDate', '@common/utils');
            expr = ts.factory.createJsxExpression(
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('formatDate'),
                undefined,
                [
                  spelOrStringLiteral(node[':@']['@_value'] ?? ''),
                ],
              ),
            );
          } else {
            expr = ts.factory.createJsxExpression(
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('convert'),
                undefined,
                [ts.factory.createObjectLiteralExpression(attrs)],
              ),
            );
          }
        } else if (key === 'f:convertDateTime') {
          expr = ts.factory.createJsxExpression(
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier('convertDateTime'),
              undefined,
              [
                ts.factory.createObjectLiteralExpression([
                  ts.factory.createPropertyAssignment(
                    'pattern',
                    ts.factory.createStringLiteral(
                      child[':@']['@_pattern'] ?? '',
                    ),
                  ),
                  ts.factory.createPropertyAssignment(
                    'timeZone',
                    ts.factory.createStringLiteral(
                      child[':@']['@_timeZone'] ?? '',
                    ),
                  ),
                  ts.factory.createPropertyAssignment(
                    'value',
                    ts.factory.createStringLiteral(node[':@']['@_value'] ?? ''),
                  ),
                ]),
              ],
            ),
          );
        } else if (key === 'c:if') {
          this.addWarning('WARN: <c:if> in <t:outputText> is not supported, so we have to rewrite it manually.');
        } else if (key === '#text') {
          this.addWarning('WARN: #text in <t:outputText> was probably added in PSAK by mistake.');
        } else if (key === 'nav:outputPid') {
          this.addWarning('WARN: <nav:outputPid> in <t:outputText> is probably a mistake. This should be migrated manually!');
        } else {
          throw new Error('WARN: Unknown child in <t:outputText>: ' + key);
        }
      }
    }

    if (attributes.length > 0) {
      // Create a <span>
      this.result = ts.factory.createJsxElement(
        ts.factory.createJsxOpeningElement(
          ts.factory.createIdentifier('span'),
          undefined,
          ts.factory.createJsxAttributes(attributes),
        ),
        [expr],
        ts.factory.createJsxClosingElement(ts.factory.createIdentifier('span')),
      );
    } else {
      this.result = ts.factory.createJsxFragment(
        ts.factory.createJsxOpeningFragment(),
        [expr],
        ts.factory.createJsxJsxClosingFragment(),
      );
    }

    this.handleRenderedProp(rendered);
  }

  withStringShouldBeJSX(fn: () => void) {
    const stringShouldBeJSX = this.stringShouldBeJSX;
    this.stringShouldBeJSX = true;
    fn();
    this.stringShouldBeJSX = stringShouldBeJSX;
  }

  withStringShouldNotBeJSX(fn: () => void) {
    const stringShouldBeJSX = this.stringShouldBeJSX;
    this.stringShouldBeJSX = false;
    fn();
    this.stringShouldBeJSX = stringShouldBeJSX;
  }

  withExpressionShouldNotBeWrappedInJSX(fn: () => void) {
    const expressionShouldNotBeWrappedInJSX = this.expressionShouldNotBeWrappedInJSX;
    this.expressionShouldNotBeWrappedInJSX = true;
    fn();
    this.expressionShouldNotBeWrappedInJSX = expressionShouldNotBeWrappedInJSX;
  }

  visitHtmlNode(node: HtmlNode) {
    let rendered;

    this.withStringShouldBeJSX(() => {
      const attributes = [];
      for (const [key, value] of Object.entries(node[':@'] ?? {})) {
        if (key === '@_rendered') {
          rendered = value;
          continue;
        }

        // Strip @_ prefix if it's there, so for example @_class becomes class
        const attributeName = key.replace(/^@_/, '');

        // Special case for alt attribute
        let parsedValue = value;
        if (['alt', 'title'].includes(attributeName)) {
          parsedValue = this.handleText(value, true);
        }

        const reactAttributeName = convertToReactAttributeName(attributeName);
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier(reactAttributeName),
            ts.factory.createStringLiteral(parsedValue),
          ),
        );
      }
      for (const [key, value] of Object.entries(node)) {
        if (key === ':@') {
          continue;
        } else if (key === 'body') {
          // Weird. Some templates just have a <body> tag which is not supposed to be there.
          // Just visit the first child, and early-return.
          this.visit(node['body'][0]);
          return;
        } else {
          const children = [];
          for (const child of value) {
            this.visit(child);
            children.push(this.result);
          }
          this.result = ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier(key),
              undefined,
              ts.factory.createJsxAttributes(attributes),
            ),
            children,
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier(key),
            ),
          );
          this.handleRenderedProp(rendered);
        }
      }
    });
  }

  visitHtmlTagNode(node: HtmlTagNode) {
    const attributes = [];
    const children = [];
    for (const child of node['t:htmlTag']) {
      this.withStringShouldBeJSX(() => {
        if ('f:param' in child) {
          const name = child[':@']['@_name'];
          const value = child[':@']['@_value'];

          // Convert to React attribute name
          const reactAttributeName = convertToReactAttributeName(name);
          attributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier(reactAttributeName),
              spelOrStringLiteral(value, true),
              // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value)),
              // ts.factory.createStringLiteral(value),
            ),
          );
        } else {
          this.visit(child);
          children.push(this.result);
        }
      });
    }

    let tagName = 'UnknownHtmlTag';
    let rendered;

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_value') {
        tagName = value;
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value)),
            // ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in htmlTag: ' + key);
      }
    }

    // generate JSX for example if value is div, then generate a <div> with the children
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitOutputScript(node: OutputScriptNode) {
    // Get the children and wrap it in a simple <script> tag.
    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['h:outputScript']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('script'),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('script')),
    );
  }

  visitDataTable(node: DataTableNode) {
    this.addImport('DataTable', '@common/DataTable');
    const attributes = [];

    let value = 'unknown';
    let varName = 'data';
    let rowIndexVar;
    let rowStyleClass;
    let rendered;
    let columnClasses: string[] = [];
    let footerClass;

    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_rendered') {
        rendered = attributeValue;
      } else if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_value') {
        value = attributeValue;
      } else if (key === '@_var') {
        varName = attributeValue;
      } else if (key === '@_rowIndexVar') {
        rowIndexVar = attributeValue;
      } else if (key === '@_rowCountVar') {
        // looks like it's being provided a few places, but not really being in use. Skip it.
      } else if (key === '@_columns') {
        // data-unrecognized-property-columns="the-attribute-value"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unrecognized-property-columns'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_newspaperColumns') {
        // data-unrecognized-property-newspaper-columns="the-attribute-value"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier(
              'data-unrecognized-property-newspaper-columns',
            ),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_summary') {
        // summary="the-attribute-value"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('summary'),
            this.handleText(attributeValue, true),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(attributeValue);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_columnClasses') {
        // Skip auto-setup of columnClasses if it's dynamically evaluated.
        if (!attributeValue.startsWith('#{') && !attributeValue.startsWith('${')) {
          columnClasses = attributeValue.split(',').map(str => str.trim());
        }

        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('columnClasses'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_rowClasses') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('rowClasses'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_rowStyleClass') {
        rowStyleClass = attributeValue;
      } else if (key === '@_title') {
        const text = this.handleText(attributeValue, true);
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(attributeValue, true),
          ),
        );
      } else if (key === '@_cellpadding') {
        // Not even supported in HTML5
      } else if (key === '@_cellspacing') {
        // Not even supported in HTML5
      } else if (key === '@_width') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('width'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_renderedIfEmpty') {
        if (attributeValue !== 'true') {
          // data-todo-set-rendered-if-empty="the-attribute-value"
          attributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier('data-todo-set-rendered-if-empty'),
              ts.factory.createStringLiteral(attributeValue),
            ),
          );
        }
      } else if (key === '@_headerClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('headerClassName'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_footerClass') {
        footerClass = attributeValue;
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('footerClassName'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createJsxExpression(undefined,
            // spelOrStringLiteral(attributeValue)),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_border') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('border'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_first') {
        // TODO replace first/rows with a better way of solving pagination
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('first'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_rows') {
        // TODO replace first/rows with a better way of solving pagination
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('rows'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else {
        throw new Error('Unexpected attribute in dataTable: ' + key);
      }
    }

    const globalHeaders = [];
    const headers = [];
    const footers = [];
    const globalFooters = [];
    const columns = [];

    const children = (node['t:dataTable'] ?? node['h:dataTable'])
    for (let i = 0; i < children.length; i++) {
      const column = children[i];
      const cellContent = [];

      if ('t:column' in column || 'h:column' in column) {
        for (const columnChild of column['t:column'] ?? column['h:column']) {
          if ('f:facet' in columnChild) {
            const name = columnChild[':@']['@_name'];
            const facetContent = [];
            this.withStringShouldBeJSX(() => {
              for (const facetChild of columnChild['f:facet']) {
                this.visit(facetChild);
                facetContent.push(this.result);
              }
            });

            // create <th> and add to headers
            if (name === 'header') {
              headers.push(
                ts.factory.createJsxElement(
                  ts.factory.createJsxOpeningElement(
                    ts.factory.createIdentifier('th'),
                    undefined,
                    ts.factory.createJsxAttributes([]),
                  ),
                  // [],
                  facetContent,
                  ts.factory.createJsxClosingElement(
                    ts.factory.createIdentifier('th'),
                  ),
                ),
              );
            } else if (name === 'footer') {
              footers.push(
                ts.factory.createJsxElement(
                  ts.factory.createJsxOpeningElement(
                    ts.factory.createIdentifier('td'),
                    undefined,
                    ts.factory.createJsxAttributes([]),
                  ),
                  // [],
                  facetContent,
                  ts.factory.createJsxClosingElement(
                    ts.factory.createIdentifier('td'),
                  ),
                ),
              );
            } else {
              throw new Error('Unknown facet name: ' + name);
            }
          } else {
            // It's a "regular" row
            this.withStringShouldBeJSX(() => {
              this.visit(columnChild);
              cellContent.push(this.result);
            });
          }
        }

        const cellAttributes = [];
        if (columnClasses[i] !== undefined) {
          cellAttributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier('className'),
              spelOrStringLiteral(columnClasses[i], true),
              // ts.factory.createStringLiteral(columnClasses[i]),
            ),
          );
        }
        columns.push(
          // create td
          ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier('td'),
              undefined,
              ts.factory.createJsxAttributes(cellAttributes),
            ),
            // [],
            cellContent,
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier('td'),
            ),
          ),
        );
      } else if ('f:facet' in column) {
        const name = column[':@']['@_name'];
        const facetContent = [];
        this.withStringShouldBeJSX(() => {
          for (const facetChild of column['f:facet']) {
            this.visit(facetChild);
            facetContent.push(this.result);
          }
        });
        if (name === 'header') {
          // create <thead><tr><th>...</th></tr></thead>
          const header = ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier('th'),
              undefined,
              ts.factory.createJsxAttributes([]),
            ),
            facetContent,
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier('th'),
            ),
          );

          // wrap the th in <thead> and <tr>
          const wrapped = ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier('thead'),
              undefined,
              ts.factory.createJsxAttributes([]),
            ),
            [
              ts.factory.createJsxElement(
                ts.factory.createJsxOpeningElement(
                  ts.factory.createIdentifier('tr'),
                  undefined,
                  ts.factory.createJsxAttributes([]),
                ),
                [header],
                ts.factory.createJsxClosingElement(
                  ts.factory.createIdentifier('tr'),
                ),
              ),
            ],
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier('thead'),
            ),
          );

          globalHeaders.push(wrapped);
        } else if (name === 'footer') {
          // create <tfoot><tr><td>...</td></tr></tfoot>
          const footerAttributes = [];
          if (footerClass !== undefined) {
            footerAttributes.push(
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('className'),
                spelOrStringLiteral(footerClass, true),
                // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(footerClass)),
                // ts.factory.createStringLiteral(footerClass),
              ),
            );
          }
          // Add colSpan=9999
          footerAttributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier('colSpan'),
              ts.factory.createJsxText('{9999}'),
            ),
          );

          const footer = ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier('td'),
              undefined,
              ts.factory.createJsxAttributes(footerAttributes),
            ),
            facetContent,
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier('td'),
            ),
          );

          const wrapped = ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier('tfoot'),
              undefined,
              ts.factory.createJsxAttributes([]),
            ),
            [
              ts.factory.createJsxElement(
                ts.factory.createJsxOpeningElement(
                  ts.factory.createIdentifier('tr'),
                  undefined,
                  ts.factory.createJsxAttributes([]),
                ),
                [footer],
                ts.factory.createJsxClosingElement(
                  ts.factory.createIdentifier('tr'),
                ),
              ),
            ],
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier('tfoot'),
            ),
          );
          globalFooters.push(wrapped);
        } else {
          throw new Error('Unrecognized facet name: ' + name);
        }
      } else {
        this.addWarning('Could not recognize node ' + JSON.stringify(column, null, '  '));
      }
    }

    const thead = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('thead'),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      [
        ts.factory.createJsxElement(
          ts.factory.createJsxOpeningElement(
            ts.factory.createIdentifier('tr'),
            undefined,
            ts.factory.createJsxAttributes([]),
          ),
          headers,
          ts.factory.createJsxClosingElement(ts.factory.createIdentifier('tr')),
        ),
      ],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('thead')),
    );

    const rowAttributes = [];
    if (rowStyleClass !== undefined) {
      rowAttributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('className'),
          spelOrStringLiteral(rowStyleClass, true),
          // ts.factory.createStringLiteral(rowStyleClass),
        ),
      );
    }
    const row = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('tr'),
        undefined,
        ts.factory.createJsxAttributes(rowAttributes),
      ),
      columns,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('tr')),
    );

    // when value is "foo" and var is "bar", we want to generate:
    // {foo.map(bar => <tr>...</tr>)}
    // or
    // {foo.map((bar, rowIndex) => <tr>...</tr>)} if rowIndexVar is set

    const lambdaParameters = [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        varName,
      ),
    ];
    if (rowIndexVar !== undefined) {
      lambdaParameters.push(
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          rowIndexVar,
        ),
      );
    }

    let valueAst;
    try {
      valueAst = toTypeScript(value);
    } catch (e) {
      // create a string literal
      valueAst = ts.factory.createStringLiteral(value);
    }

    const rowLambda = ts.factory.createJsxExpression(
      undefined,
      ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          valueAst,
          'map',
        ),
        undefined,
        [
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            lambdaParameters,
            undefined,
            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            row,
          ),
        ],
      ),
    );

    const tbody = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('tbody'),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      [rowLambda],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('tbody')),
    );

    const tfoot = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('tfoot'),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      [
        ts.factory.createJsxElement(
          ts.factory.createJsxOpeningElement(
            ts.factory.createIdentifier('tr'),
            undefined,
            ts.factory.createJsxAttributes([]),
          ),
          footers,
          ts.factory.createJsxClosingElement(ts.factory.createIdentifier('tr')),
        ),
      ],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('tfoot')),
    );

    const tagName = 'DataTable';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      [...globalHeaders, thead, tbody, tfoot, ...globalFooters],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitSelectOneRow(node: SelectOneRowNode) {
    // Create <div>TODO: implement this manually</div>
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('div'),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      [
        ts.factory.createJsxText(
          'TODO: implement this manually: t:selectOneRow',
        )
      ],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('div')),
    );
  }

  visitDataList(node: DataListNode) {
    const attributes = [];

    let layout = 'simple';
    let value = 'unknown';
    let varName = 'data';
    let rowIndexVar;

    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_layout') {
        layout = value;
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_value') {
        value = attributeValue;
      } else if (key === '@_var') {
        varName = attributeValue;
      } else if (key === '@_rowIndexVar') {
        rowIndexVar = attributeValue;
      } else if (key === '@_columnClasses') {
        // data-unknown-property-columnClasses="the-attribute-value"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-property-columnClasses'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_headerClass') {
        // data-unknown-property-headerClass="the-attribute-value"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-property-headerClass'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else {
        throw new Error('Unexpected attribute in dataList: ' + key);
      }
    }

    let valueAst;
    try {
      valueAst = toTypeScript(value);
    } catch (e) {
      console.log('Could not parse value: ' + value);
      valueAst = ts.factory.createStringLiteral(value);
    }

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['t:dataList']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    const lambdaParameters = [ts.factory.createParameterDeclaration(
      undefined,
      undefined,
      varName,
    )];

    if (rowIndexVar !== undefined) {
      lambdaParameters.push(
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          rowIndexVar,
        ),
      );
    }

    if (layout === 'simple') {
      // Should be {"value".map(varName => <>children</>)}
      const lambda = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            valueAst,
            'map',
          ),
          undefined,
          [
            ts.factory.createArrowFunction(
              undefined,
              undefined,
              lambdaParameters,
              undefined,
              ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              ts.factory.createJsxFragment(
                ts.factory.createJsxOpeningFragment(),
                children,
                ts.factory.createJsxJsxClosingFragment(),
              ),
            ),
          ],
        ),
      );

      // Crate div with the attributes
      this.result = ts.factory.createJsxElement(
        ts.factory.createJsxOpeningElement(
          ts.factory.createIdentifier('div'),
          undefined,
          ts.factory.createJsxAttributes(attributes),
        ),
        [lambda],
        ts.factory.createJsxClosingElement(ts.factory.createIdentifier('div')),
      );
    } else {
      // Should be {"value".map(varName => <li>children</li>)}
      const lambda = ts.factory.createJsxExpression(
        undefined,
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            valueAst,
            'map',
          ),
          undefined,
          [
            ts.factory.createArrowFunction(
              undefined,
              undefined,
              lambdaParameters,
              undefined,
              ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              ts.factory.createJsxElement(
                ts.factory.createJsxOpeningElement(
                  ts.factory.createIdentifier('li'),
                  undefined,
                  ts.factory.createJsxAttributes([]),
                ),
                children,
                ts.factory.createJsxClosingElement(
                  ts.factory.createIdentifier('li'),
                ),
              ),
            ),
          ],
        ),
      );

      // Create ul with the attributes
      this.result = ts.factory.createJsxElement(
        ts.factory.createJsxOpeningElement(
          ts.factory.createIdentifier('ul'),
          undefined,
          ts.factory.createJsxAttributes(attributes),
        ),
        [lambda],
        ts.factory.createJsxClosingElement(ts.factory.createIdentifier('ul')),
      );
    }
  }

  visitForm(node: FormNode) {
    const attributes = [];
    let rendered;

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_name') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('name'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute on form: ' + key);
      }
    }

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['h:form']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('form'),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(
        ts.factory.createIdentifier('form'),
      ),
    );
    this.handleRenderedProp(rendered);
  }

  visitIf(node: IfNode) {
    let test;
    for (const [key, value] of Object.entries(node[':@'])) {
      if (key === '@_test') {
        test = value;
      } else {
        throw new Error('Unexpected attribute on c:if: ' + key);
      }
    }

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['c:if']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    this.result = ts.factory.createJsxFragment(
      ts.factory.createJsxOpeningFragment(),
      children,
      ts.factory.createJsxJsxClosingFragment(),
    );
    this.handleRenderedProp(test);
  }

  visitWhen(node: WhenNode) {
    const test = node[':@']['@_test'];
    const children = [];
    for (const child of node['c:when']) {
      this.visit(child);
      children.push(this.result);
    }

    this.result = ts.factory.createJsxExpression(
      undefined,
      ts.factory.createConditionalExpression(
        ts.factory.createStringLiteral(test),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createJsxFragment(
          ts.factory.createJsxOpeningFragment(),
          children,
          ts.factory.createJsxJsxClosingFragment(),
        ),
        ts.factory.createToken(ts.SyntaxKind.ColonToken),
        ts.factory.createNull(),
      ),
    );
  }

  visitChoose(node: ChooseNode) {
    const conditions = [];
    let otherwise = undefined;

    for (const child of node['c:choose']) {
      for (const [key, values] of Object.entries(child)) {
        if (key === ':@') {
          continue;
        } else if (key === 'c:when') {
          // It's a when node
          const test = child[':@']['@_test'];
          const children = [];
          this.withStringShouldBeJSX(() => {
            for (const child of values) {
              this.visit(child);
              children.push(this.result);
            }
          });

          const block = ts.factory.createBlock([ts.factory.createReturnStatement(
            ts.factory.createJsxFragment(
              ts.factory.createJsxOpeningFragment(),
              children,
              ts.factory.createJsxJsxClosingFragment(),
            ),
          )]);

          conditions.push({test, then: block});
        } else if (key === 'c:otherwise') {
          // It's an otherwise node
          const children = [];
          this.withStringShouldBeJSX(() => {
            for (const child of values) {
              this.visit(child);
              children.push(this.result);
            }
          });

          otherwise = ts.factory.createBlock([ts.factory.createReturnStatement(
            ts.factory.createJsxFragment(
              ts.factory.createJsxOpeningFragment(),
              children,
              ts.factory.createJsxJsxClosingFragment(),
            ),
          )]);
        } else {
          throw new Error('Unexpected child in <c:choose>: ' + key);
        }
      }
    }

    function createNestedIfs(conditions, index, elseClause) {
      if (index < conditions.length) {
        const condition = conditions[index];
        return ts.factory.createIfStatement(
          ts.factory.createStringLiteral(condition.test),
          condition.then,
          createNestedIfs(conditions, index + 1, elseClause)
        );
      } else {
        return elseClause;
      }
    }

    const reduced = createNestedIfs(conditions, 0, otherwise);

    const block = ts.factory.createBlock([reduced]);
    const iife = ts.factory.createCallExpression(
      ts.factory.createParenthesizedExpression(
        ts.factory.createFunctionExpression(
          undefined,
          undefined,
          undefined,
          undefined,
          [],
          undefined,
          block,
        ),
      ),
      undefined,
      [],
    );
    this.result = ts.factory.createJsxExpression(undefined, iife);
  }

  visitUpdateActionListener(node: UpdateActionListenerNode) {
    // Just use a {/* todo updateActionListener */} comment
    this.result = ts.factory.createJsxText(
      '{/* todo: updateActionListener */}',
    );
  }

  visitSetPropertyActionListener(node: SetPropertyActionListenerNode) {
    // Just use a {/* todo setPropertyActionListener */} comment
    this.result = ts.factory.createJsxText(
      '{/* todo: setPropertyActionListener */}',
    );
  }

  visitUIFragment(node: UIFragmentNode) {
    const rendered = node[':@']?.['@_rendered'];
    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['ui:fragment']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    const fragment = ts.factory.createJsxFragment(
      ts.factory.createJsxOpeningFragment(),
      children,
      ts.factory.createJsxJsxClosingFragment(),
    );

    this.result = fragment;
    this.handleRenderedProp(rendered);
  }

  visitUnexpectedFacet(node: UnexpectedFacetNode) {
    const name = node[':@']['@_name'];

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['f:facet']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    const tagName = 'UnexpectedFacet';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes([
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('name'),
            ts.factory.createStringLiteral(name),
          ),
        ]),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
  }

  visitUnexpectedColumn(node: UnexpectedColumnNode) {
    // basically like visitUnexpectedFacet but now with <UnexpectedColumn>

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['h:column'] ?? node['t:column'] ?? []) {
        this.visit(child);
        children.push(this.result);
      }
    });

    const tagName = 'UnexpectedColumn';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
  }

  visitOutputLabel(node: OutputLabelNode) {
    const attributes = [];
    let value;
    let rendered;

    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_for') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('htmlFor'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_value') {
        value = attributeValue;
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(attributeValue);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_rendered') {
        rendered = attributeValue;
      } else {
        throw new Error('Unexpected attribute in outputLabel: ' + key);
      }
    }

    // Return <label htmlFor="foo">bar</label>
    const children = [];
    if (value !== undefined) {
      this.withStringShouldBeJSX(() => {
        children.push(this.handleText(value));
      });
    }
    this.withStringShouldBeJSX(() => {
      for (const child of (node['h:outputLabel'] ?? node['t:outputLabel'] ?? [])) {
        this.visit(child);
        children.push(this.result);
      }
    });

    const tagName = 'label';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitUIRepeat(node: UIRepeatNode) {
    let value;
    let variable;
    let varStatus;

    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_value') {
        value = attributeValue;
      } else if (key === '@_var') {
        variable = attributeValue;
      } else if (key === '@_varStatus') {
        varStatus = attributeValue;
      } else if (key === '@_id') {
        this.addWarning('WARN: somebody added id to ui:repeat but it is not supported in JSF.');
      } else {
        throw new Error('Unexpected attribute in ui:repeat: ' + key);
      }
    }

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['ui:repeat']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    let lambdaParameters;
    if (varStatus !== undefined) {
      // One argument, which is a destructured object, so if var=foo and varStatus=status, it should be:
      // {value.map(({ for, status }) => <>children</>)}
      lambdaParameters = [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          ts.factory.createObjectBindingPattern([
            ts.factory.createBindingElement(
              undefined,
              undefined,
              variable,
              undefined,
            ),
            ts.factory.createBindingElement(
              undefined,
              undefined,
              varStatus,
              undefined,
            ),
          ]),
        ),
      ];
    } else {
      lambdaParameters = [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          variable,
        ),
      ];
    }

    let valueAst;
    try {
      valueAst = toTypeScript(value);
    } catch (e) {
      // create a string literal
      valueAst = ts.factory.createStringLiteral(value);
    }

    const result =
      ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          valueAst,
          'map',
        ),
        undefined,
        [
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            lambdaParameters,
            undefined,
            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.factory.createJsxFragment(
              ts.factory.createJsxOpeningFragment(),
              children,
              ts.factory.createJsxJsxClosingFragment(),
            ),
          ),
        ],
      );

    if (this.expressionShouldNotBeWrappedInJSX) {
      this.result = result;
    } else {
      this.result = ts.factory.createJsxExpression(
        undefined,
        result
      );
    }
  }

  visitUIRemove(node: UIRemoveNode) {
    // Just use a {/* todo UIRemove */} comment
    this.result = ts.factory.createJsxText('{/* content removed with ui:remove */}');
  }

  visitSubview(node: SubviewNode) {
    let rendered;
    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        // skip it, not sure what to do with it.
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in subview: ' + key);
      }
    }

    // Just grab all children and wrap in a <>fragment</>
    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['f:subview']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    this.result = ts.factory.createJsxFragment(
      ts.factory.createJsxOpeningFragment(),
      children,
      ts.factory.createJsxJsxClosingFragment(),
    );
    this.handleRenderedProp(rendered);
  }

  visitButton(node: ButtonNode) {
    const attributes = [];
    let rendered;

    // <input type="button"
    attributes.push(
      ts.factory.createJsxAttribute(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral('button'),
      ),
    );

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_alt') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('alt'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in button: ' + key);
      }
    }

    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier('input'),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
    this.handleRenderedProp(rendered);
  }

  visitOutputFormat(node: OutputFormatNode) {
    const attributes = [];
    let value;
    let rendered;

    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = attributeValue;
      } else if (key === '@_value') {
        value = attributeValue;
      } else {
        throw new Error('Unexpected attribute in outputFormat: ' + key);
      }
    }

    // Loop through the children and check for f:param
    const params = [];
    for (const child of node['h:outputFormat']) {
      if ('f:param' in child) {
        const value = child[':@']['@_value'];
        params.push(ts.factory.createStringLiteral(value));
      }
    }

    // basically it should be format(value, ...params)
    let parsedValue;
    this.withStringShouldNotBeJSX(() => {
      parsedValue = this.handleText(value);
      // parsedValue = spelOrStringLiteral(value);
    });

    const functionCall = ts.factory.createCallExpression(
      ts.factory.createIdentifier('format'),
      undefined,
      [
        parsedValue,
        ...params,
      ],
    );

    const expr = ts.factory.createJsxExpression(
      undefined,
      functionCall,
    );

    // Wrap it up in a <span>
    const tagName = 'span';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      [expr],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitVerbatim(node: VerbatimNode) {
    const nodes = node['f:verbatim'];
    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of nodes) {
        this.visit(child);
        children.push(this.result);
      }
    });

    // Just a React fragment with all the children
    this.result = ts.factory.createJsxFragment(
      ts.factory.createJsxOpeningFragment(),
      children,
      ts.factory.createJsxJsxClosingFragment(),
    );
  }

  visitPanelGroup(node: PanelGroupNode) {
    const attributes = [];
    const nodeIndex = node['t:panelGroup'] !== undefined ? 't:panelGroup' : 'h:panelGroup';

    let rendered;
    let layout;
    let isSimple = node[nodeIndex]?.length === 1;
    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        isSimple = false;
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        isSimple = false;
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_class') {
        // Probably the user meant styleClass
        isSimple = false;
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        isSimple = false;
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_layout') {
        isSimple = false;
        layout = value;
      } else if (key === '@_colspan') {
        this.addWarning('WARN: it is not clear what "colspan" does in panelGroup.');
      } else if (key === '@_value') {
        this.addWarning('WARN: it is not clear what "value" does in panelGroup.');
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in panelGroup: ' + key);
      }
    }


    const wrapperElement = layout === 'block' ? 'div' : 'span';

    // Check if there's only one child, and no styleClass, style or layout
    if (isSimple) {
      this.visit(node[nodeIndex][0]);

      if (rendered !== undefined && rendered !== 'true') {
        // Render {rendered && <>{this.result}</>}
        let renderedAst;
        try {
          renderedAst = toTypeScript(rendered);
        } catch (error) {
          console.error('Could not parse SPEL', rendered);
          renderedAst = ts.factory.createStringLiteral(rendered);
        }

        this.result = ts.factory.createJsxExpression(
          undefined,
          ts.factory.createLogicalAnd(
            renderedAst,
            ts.factory.createJsxFragment(
              ts.factory.createJsxOpeningFragment(),
              [this.result],
              ts.factory.createJsxJsxClosingFragment(),
            ),
          ),
        );
      }
    } else {
      // Create <wrapperElement className="styleClass" style="style">children</div>
      const children = [];
      this.withStringShouldBeJSX(() => {
        for (const child of node[nodeIndex]) {
          this.visit(child);
          children.push(this.result);
        }
      });

      this.result = ts.factory.createJsxElement(
        ts.factory.createJsxOpeningElement(
          ts.factory.createIdentifier(wrapperElement),
          undefined,
          ts.factory.createJsxAttributes(attributes),
        ),
        children,
        ts.factory.createJsxClosingElement(
          ts.factory.createIdentifier(wrapperElement),
        ),
      );
      this.handleRenderedProp(rendered);
    }
  }

  visitPanelGrid(node: PanelGridNode) {
    const attributes = [];
    const children = [];
    let rendered;
    let columns;
    let columnClasses = [];
    let rowClasses = [];

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_columns') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('columns'),
            ts.factory.createStringLiteral(value),
          ),
        );
        if (isInteger(value)) {
          columns = parseInt(value, 10);
        }
      } else if (key === '@_idcolumns') {
        // probably a typo. Assume that it was supposed to be "columns".
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('columns'),
            ts.factory.createStringLiteral(value),
          ),
        );
        if (isInteger(value)) {
          columns = parseInt(value, 10);
        }
      } else if (key === '@_columnClasses') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('columnClasses'),
            ts.factory.createStringLiteral(value),
          ),
        );
        columnClasses = value.split(',').map(str => str.trim());
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_rowClasses') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('rowClasses'),
            ts.factory.createStringLiteral(value),
          ),
        );
        rowClasses = value.split(',').map(str => str.trim());
      } else if (key === '@_headerClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('headerClass'),
            ts.factory.createStringLiteral(value),
          ),
        )
      } else if (key === '@_footerClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('footerClass'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_width') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('width'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in panelGrid: ' + key);
      }
    }

    const isDynamic = columns === undefined;
    if (isDynamic) {
      this.addImport('DynamicPanelGrid', '@common/DynamicPanelGrid');
      this.addImport('DynamicPanel', '@common/DynamicPanelGrid');
    } else {
      this.addImport('PanelGrid', '@common/PanelGrid');
      this.addImport('PanelGridRow', '@common/PanelGrid');
      this.addImport('Panel', '@common/PanelGrid');
    }

    const tagName = isDynamic ? 'DynamicPanelGrid' : 'PanelGrid';
    const rowTagName = 'PanelGridRow';

    let rowIdx = 0;
    let currentRow = [];
    const panelGridChildren = (node['t:panelGrid'] ?? node['h:panelGrid']) ?? [];
    for (let i = 0; i < panelGridChildren.length; i++) {
      const child = panelGridChildren[i];
      this.visit(child);
      const result = this.result;

      const attributes = [];
      if (!isDynamic) {
        const columnIdx = currentRow.length % columns;
        if (columnClasses[columnIdx] !== undefined) {
          // add className
          attributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier('className'),
              spelOrStringLiteral(columnClasses[columnIdx], true),
              // ts.factory.createStringLiteral(columnClasses[columnIdx]),
            ),
          )
        }
      }

      // wrap result in a <Panel>
      const panelTagName = isDynamic ? 'DynamicPanel' : 'Panel';
      const wrapped = ts.factory.createJsxElement(
        ts.factory.createJsxOpeningElement(
          ts.factory.createIdentifier(panelTagName),
          undefined,
          ts.factory.createJsxAttributes(attributes),
        ),
        [result],
        ts.factory.createJsxClosingElement(ts.factory.createIdentifier(panelTagName)),
      );

      if (!isDynamic) {
        if (currentRow.length === columns) {
          // We should add the existing row, and start a fresh one
          // Wrap all the elements in currentRow in <PanelGridRow> and append it to children

          const rowAttributes = [];
          if (rowClasses[rowIdx] !== undefined) {
            // add className
            rowAttributes.push(
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('className'),
                spelOrStringLiteral(rowClasses[rowIdx], true),
                // ts.factory.createStringLiteral(rowClasses[rowIdx]),
              ),
            )
          }

          children.push(
            ts.factory.createJsxElement(
              ts.factory.createJsxOpeningElement(
                ts.factory.createIdentifier(rowTagName),
                undefined,
                ts.factory.createJsxAttributes(rowAttributes)
              ),
              currentRow,
              ts.factory.createJsxClosingElement(ts.factory.createIdentifier(rowTagName)),
            )
          );

          currentRow = [];
          rowIdx++;
        }
        currentRow.push(wrapped);
      } else {
        children.push(wrapped);
      }
    }

    if (!isDynamic) {
      const rowAttributes = [];
      if (rowClasses[rowIdx] !== undefined) {
        // add className
        rowAttributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            spelOrStringLiteral(rowClasses[rowIdx], true),
            // ts.factory.createStringLiteral(rowClasses[rowIdx]),
          ),
        )
      }

      // add any leftover cells
      if (currentRow.length > 0) {
        children.push(
          ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier(rowTagName),
              undefined,
              ts.factory.createJsxAttributes(rowAttributes),
            ),
            currentRow,
            ts.factory.createJsxClosingElement(ts.factory.createIdentifier(rowTagName)),
          )
        );
      }
    }

    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitTree2(node: Tree2Node) {
    const tagName = 'Tree2';
    // Just an empty div for now, with a comment /* TODO Tree2 here */ inside it
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes([]),
      ),
      [ts.factory.createJsxText('TODO Tree2 here')],
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
  }

  visitSelectOneMenu(node: SelectOneMenuNode) {
    // Create <div>TODO: SelectOneMenuNode</div>
    const tagName = 'Select';
    const optionTagName = 'option';
    const options = [];
    let rendered;

    const attributes = [];
    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            spelOrStringLiteral(value, true),
            /*
            ts.factory.createJsxExpression(
              undefined,
              spelOrStringLiteral(value)
            )

             */
          ),
        );
      } else if (key === '@_label') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('label'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_onchange') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onChange'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_valueChangeListener') {
        // unknown
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-property-valueChangeListener'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_readonly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('readOnly'),
            spelOrStringLiteral(value, true),
            // ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            spelOrStringLiteral(value, true),
            // ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_displayValueOnly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('displayValueOnly'),
            spelOrStringLiteral(value, true),
            /*
            ts.factory.createJsxExpression(
              undefined,
              spelOrStringLiteral(value)
            )
             */
          ),
        );
      } else if (key === '@_displayValueOnlyStyleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('displayValueOnlyClassName'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(value),
          ),
        );
      } else if (key === '@_action') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('action'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in selectOneMenu: ' + key);
      }
    }

    let label;

    for (const child of (node['t:selectOneMenu'] ?? node['h:selectOneMenu'])) {
      // if it's a f:selectItem, we should read itemLabel and itemValue and add it to options
      if ('t:selectItem' in child || 'f:selectItem' in child) {
        const itemLabel = child[':@']['@_itemLabel'];
        const itemValue = child[':@']['@_itemValue'];

        const optionChildren = [];
        if (itemLabel !== undefined) {
          this.withStringShouldBeJSX(() => {
            optionChildren.push(this.handleText(itemLabel));
          });
        }

        options.push(
          ts.factory.createJsxElement(
            ts.factory.createJsxOpeningElement(
              ts.factory.createIdentifier(optionTagName),
              undefined,
              ts.factory.createJsxAttributes([
                ts.factory.createJsxAttribute(
                  ts.factory.createIdentifier('value'),
                  spelOrStringLiteral(itemValue, true),
                  // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(itemValue))
                ),
              ]),
            ),
            optionChildren,
            ts.factory.createJsxClosingElement(
              ts.factory.createIdentifier(optionTagName),
            ),
          ),
        );
      } else if ('f:selectItems' in child) {
        const value = child[':@']['@_value'];
        const varName = 'item';

        let accessorAst;
        try {
          accessorAst = toTypeScript(value);
        } catch (err) {
          console.error('Could not parse SPEL ' + value, err);
          accessorAst = ts.factory.createElementAccessExpression(
            ts.factory.createIdentifier('props'),
            ts.factory.createStringLiteral(value),
          );
        }

        const optionJsx = ts.factory.createJsxElement(
          ts.factory.createJsxOpeningElement(
            ts.factory.createIdentifier(optionTagName),
            undefined,
            ts.factory.createJsxAttributes([
              // key=item.value
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('key'),
                ts.factory.createJsxExpression(
                  undefined,
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(varName),
                    'value',
                  ),
                ),
              ),
              // value=item.value
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('value'),
                ts.factory.createJsxExpression(
                  undefined,
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(varName),
                    'value',
                  ),
                ),
              ),
            ]),
          ),
          [
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(varName),
                'label',
              ),
            ),
          ],
          ts.factory.createJsxClosingElement(
            ts.factory.createIdentifier(optionTagName),
          ),
        );

        // props["something"].map(item => <option value={item.value}>{item.label}</option>)
        const lambda = ts.factory.createJsxExpression(
          undefined,
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(accessorAst, 'map'),
            undefined,
            [
              ts.factory.createArrowFunction(
                undefined,
                undefined,
                [
                  ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    varName,
                  ),
                ],
                undefined,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                optionJsx,
              ),
            ],
          ),
        );

        options.push(lambda);
        // this.result = optionJsx;
      } else if ('f:ajax' in child) {
        // If we have <f:ajax listener="something" />, we should generate:
        // onChange={props["something"]}
        const listener = child[':@']['@_listener'] ?? 'unknown-listener';

        const onChange = ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('onChange'),
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('props'),
            listener,
          ),
        );
      } else if ('h:commandButton' in child) {
        // For some reason, this is actually done in JSF, but let's just skip it.
      } else if ('t:outputLabel' in child || 'h:outputLabel' in child) {
        this.visitOutputLabel(child);
        label = this.result;
      } else if ('script' in child) {
        this.addWarning('WARN: <script> in selectOneMenu is not supported.');
      } else {
        throw new Error('Unexpected child ' + Object.keys(child).join(', '));
      }
    }

    let result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      options,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );

    // if label is not undefined, then result should be <>{label}{result}</>
    if (label !== undefined) {
      result = ts.factory.createJsxFragment(
        ts.factory.createJsxOpeningFragment(),
        [label, result],
        ts.factory.createJsxJsxClosingFragment(),
      );
    }

    this.result = result;

    this.handleRenderedProp(rendered);
  }

  visitSelectOneRadio(node: SelectOneMenuRadio) {
    const tagName = 'SelectOneRadio';
    const optionTagName = 'input';
    const options = [];

    const attributes = [];
    let rendered;

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value))
          ),
        );
      } else if (key === '@_layout') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('layout'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_border') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('border'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_readonly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('readOnly'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onchange') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onChange'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_valueChangeListener') {
        // unknown
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-property-valueChangeListener'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_displayValueOnly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('displayValueOnly'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in selectOneRadio: ' + key);
      }
    }

    for (const child of (node['t:selectOneRadio'] ?? node['h:selectOneRadio']) ?? []) {
      if ('f:selectItem' in child) {
        const itemLabel = child[':@']['@_itemLabel'];
        const itemValue = child[':@']['@_itemValue'];

        // We want to output <label><input type="radio" value="the-value" /> the-label</label>
        const item = ts.factory.createJsxElement(
          ts.factory.createJsxOpeningElement(
            ts.factory.createIdentifier(optionTagName),
            undefined,
            ts.factory.createJsxAttributes([
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('type'),
                ts.factory.createStringLiteral('radio'),
              ),
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('value'),
                spelOrStringLiteral(itemValue, true),
                // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(itemValue))
              ),
            ]),
          ),
          [],
          ts.factory.createJsxClosingElement(
            ts.factory.createIdentifier(optionTagName),
          ),
        );
        options.push(item);
      } else if ('f:selectItems' in child) {
        const value = child[':@']['@_value'];
        const varName = 'item';

        const accessor = ts.factory.createElementAccessExpression(
          ts.factory.createIdentifier('props'),
          ts.factory.createStringLiteral(value),
        );

        // We want to output <label><input type="radio" value="the-value" /> the-label</label>
        const optionJsx = ts.factory.createJsxElement(
          ts.factory.createJsxOpeningElement(
            ts.factory.createIdentifier(optionTagName),
            undefined,
            ts.factory.createJsxAttributes([
              // key=item.value
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('key'),
                ts.factory.createJsxExpression(
                  undefined,
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(varName),
                    'value',
                  ),
                ),
              ),
              // value=item.value
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier('value'),
                ts.factory.createJsxExpression(
                  undefined,
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(varName),
                    'value',
                  ),
                ),
              ),
            ]),
          ),
          [
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(varName),
                'label',
              ),
            ),
          ],
          ts.factory.createJsxClosingElement(
            ts.factory.createIdentifier(optionTagName),
          ),
        );

        // props["something"].map(item => <label><input type="radio" value="the-value" /> the-label</label>
        const lambda = ts.factory.createJsxExpression(
          undefined,
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(accessor, 'map'),
            undefined,
            [
              ts.factory.createArrowFunction(
                undefined,
                undefined,
                [
                  ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    varName,
                  ),
                ],
                undefined,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                optionJsx,
              ),
            ],
          ),
        );

        options.push(lambda);
      } else if ('f:ajax' in child) {
        // If we have <f:ajax listener="something" />, we should generate:
        // onChange={props["something"]}
        const listener = child[':@']['@_listener'] ?? 'unknown-listener';

        const onChange = ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('onChange'),
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('props'),
            listener,
          ),
        );
        // this.result = onChange;
      } else if ('#text' in child) {
        this.addWarning('WARN: unexpected text in selectOneRadio: ' + child['#text']);
      } else {
        throw new Error('Unexpected child in t:selectOneRadio: ' + Object.keys(child).join(', '));
      }
    }

    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      options,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitRadio(node: RadioNode) {
    const inputFor = node[':@']['@_for'];
    const index = node[':@']['@_index'];

    // Create <input type="radio" name="the-for" value="the-index" />
    const tagName = 'input';
    const attributes = [
      ts.factory.createJsxAttribute(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral('radio'),
      ),
    ];

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_for') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('name'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_index') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else {
        throw new Error('Unexpected attribute in radio: ' + key);
      }
    }

    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(tagName),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
  }

  visitAjax(node: AjaxNode) {
    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['f:ajax']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    // Return a fragment <>{/* comment about ajax */}children</>
    this.result = ts.factory.createJsxFragment(
      ts.factory.createJsxOpeningFragment(),
      [ts.factory.createJsxText('{/* TODO: some <f:ajax> stuff here */}'), ...children],
      ts.factory.createJsxJsxClosingFragment(),
    );
  }

  visitSelectBooleanCheckbox(node: SelectBooleanCheckboxNode) {
    const attributes = [];
    let rendered;

    // type=checkbox
    attributes.push(
      ts.factory.createJsxAttribute(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral('checkbox'),
      ),
    );

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('checked'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value))
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value))
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(value)
          ),
        );
      } else if (key === '@_onchange') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onChange'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in selectBooleanCheckbox: ' + key);
      }
    }

    // We basically want:
    // <input type="checkbox" id="the-id" className="the-class-name" value="the-value />
    const tagName = 'input';
    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(tagName),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
    this.handleRenderedProp(rendered);
  }

  visitInputText(node: InputTextNode) {
    const attributes = [];
    let rendered;
    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_displayValueOnly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('displayValueOnly'),
            // ts.factory.createStringLiteral(value),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value))
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_class') {
        // Probably the user meant styleClass
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value)),
            // ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_binding') {
        // binding is almost like value, but with some JSF magic.
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_converter') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('converter'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_required') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('required'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_readonly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('readOnly'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_label') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('label'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_name') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('name'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_maxlength') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('maxLength'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_size') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('size'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_validatorMessage') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('validatorMessage'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(value)
          ),
        );
      } else if (key === '@_onchange') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onChange'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onkeypress') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onKeyPress'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onblur') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onBlur'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in inputText: ' + key);
      }
    }

    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier('InputText'),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
    this.handleRenderedProp(rendered);
  }

  visitInputTextarea(node: InputTextareaNode) {
    const attributes = [];
    let rendered;
    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(attributeValue, true),
          ),
        );
      } else if (key === '@_displayValueOnly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('displayValueOnly'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_displayValueOnlyStyleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('displayValueOnlyClassName'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_immediate') {
        // Unknown
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-immediate'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_class') {
        // Probably the user meant styleClass
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_rows') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('rows'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_cols') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('cols'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_maxlength') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('maxLength'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(attributeValue);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(attributeValue)),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_readonly') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('readOnly'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(attributeValue)),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(attributeValue)),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(attributeValue)
          ),
        );
      } else if (key === '@_onkeyup') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onKeyUp'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_onchange') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onChange'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_onfocus') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onFocus'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_valueChangeListener') {
        // data-unknown-attribute-valueChangeListener="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-valueChangeListener'),
            ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = attributeValue;
      } else {
        throw new Error('Unexpected attribute in inputTextarea: ' + key);
      }
    }

    const tagName = 'Textarea';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      [],
      ts.factory.createJsxClosingElement(
        ts.factory.createIdentifier(tagName),
      ),
    );
    this.handleRenderedProp(rendered);
  }

  visitCommandLink(node: CommandLinkNode) {
    this.addImport('CommandLink', '@common/CommandLink');
    // Create <a href="#" onClick={props["something"]}>{value}</a>

    const attributes = [];
    const children = [];
    let rendered;

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_forceId') {
        // data-unknown-attribute-forceId="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-forceId'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_type') {
        // data-unknown-attribute-type="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-type'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_render') {
        // data-unknown-attribute-render="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-render'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_disabledStyleClass') {
        // data-unknown-attribute-disabledStyleClass="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-disabledStyleClass'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            this.handleText(value, true)
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(value)
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_action') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createElementAccessExpression(
                ts.factory.createIdentifier('props'),
                ts.factory.createStringLiteral(value),
              ),
            ),
          ),
        );
      } else if (key === '@_accesskey') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('accessKey'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_alt') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('alt'),
            this.handleText(value, true)
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_class') {
        // Probably the user meant styleClass
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(value, true)
          ),
        );
      } else if (key === '@_target') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('target'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_actionListener') {
        // data-unknown-attribute-actionListener="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-actionListener'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in commandLink: ' + key);
      }
    }


    this.withStringShouldBeJSX(() => {
      for (const child of (node['t:commandLink'] ?? node['h:commandLink'])) {
        if ('f:ajax' in child) {
          // ajax
          const event = child[':@']?.['@_event'] ?? 'someEvent';
          const listener = child[':@']?.['@_listener'] ?? 'unknown-listener';

          // add "on" prefix and then camelcase, for example click -> onClick
          const key =
            'on' + event.replace(/(?:^|-)(.)/g, (_, x) => x.toUpperCase());

          // if listener is "foobar" then value should be {props["foobar"]}
          const value = ts.factory.createJsxExpression(
            undefined,
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('props'),
              ts.factory.createStringLiteral(listener),
            ),
          );

          attributes.push(
            ts.factory.createJsxAttribute(
              ts.factory.createIdentifier(key),
              value,
            ),
          );
        } else {
          this.visit(child);
          children.push(this.result);
        }
      }
    });

    const tagName = 'CommandLink';

    // <CommandLink onClick={props["something"]} value="value">children here</CommandLink>
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitCommandButton(node: CommandButtonNode) {
    this.addImport('CommandButton', '@common/CommandButton');
    const attributes = [];

    let rendered;
    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(value, true)
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_class') {
        // Probably the user meant styleClass
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_action') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createElementAccessExpression(
                ts.factory.createIdentifier('props'),
                ts.factory.createStringLiteral(value),
              ),
            ),
          ),
        );
      } else if (key === '@_type') {
        // data-unknown-attribute-type="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-type'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_actionListener') {
        // data-unknown-attribute-actionListener="something"
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-actionListener'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_alt') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('alt'),
            this.handleText(value, true)
          ),
        );
      } else if (key === '@_accesskey') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('accessKey'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(value)
          ),
        );
      } else if (key === '@_disabled') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('disabled'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('value'),
            this.handleText(value, true)
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in commandButton: ' + key);
      }
    }

    // Create <CommandButton> component
    const tagName = 'CommandButton';
    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(tagName),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
    this.handleRenderedProp(rendered);
  }

  visitOutputLink(node: OutputLinkNode) {
    this.addImport('OutputLink', '@common/OutputLink');

    const children = [];
    const attributes = [];
    let rendered;

    for (const [key, attributeValue] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_value') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('href'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_class') {
        // Probably the user meant styleClass
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_target') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('target'),
            spelOrStringLiteral(attributeValue, true),
            // ts.factory.createStringLiteral(attributeValue),
          ),
        );
      } else if (key === '@_tabindex') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('tabIndex'),
            numericValue(attributeValue)
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createElementAccessExpression(
                ts.factory.createIdentifier('props'),
                ts.factory.createStringLiteral(attributeValue),
              ),
            ),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = attributeValue;
      } else {
        throw new Error('Unexpected attribute in outputLink: ' + key);
      }
    }


    this.withStringShouldBeJSX(() => {
      for (const child of node['h:outputLink']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    // return <a>
    const tagName = 'OutputLink';
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(tagName),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(tagName)),
    );
    this.handleRenderedProp(rendered);
  }

  visitParam(node: ParamNode) {
    // Just use a {/* todo param */} comment
    this.result = ts.factory.createJsxText(`{/* TODO f:param: ${node[':@']['@_name']}="${node[':@']['@_value']}" */}`);
  }

  visitGraphicImage(node: GraphicImageNode) {
    const attributes = [];
    let rendered;

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_value') {
        // value and url are both referring to src
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('src'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_url') {
        // value and url are both referring to src
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('src'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_alt') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('alt'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_width') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('width'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_height') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('height'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in graphicImage: ' + key);
      }
    }

    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier('img'),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
    this.handleRenderedProp(rendered);
  }

  visitNavNode(node: NavTagNode) {
    // Loop through all the node keys, get the first one that matches nav:<something> and then extract <something> into a variable.
    const navKey = Object.keys(node).find((key) => key.startsWith('nav:'));
    const navValue = navKey?.replace(/^nav:/, '');
    if (navValue === undefined) {
      throw new Error('Could not find nav tag');
    }

    const rendered = node[':@']?.['@_rendered'] ?? undefined;

    // Camel-case the navValue
    const name = navValue.replace(/(?:^|-)(.)/g, (_, x) => x.toUpperCase());

    // For example <nav:foobar> should be converted into <Foobar>
    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(name),
      undefined,
      ts.factory.createJsxAttributes([]),
    );
    this.handleRenderedProp(rendered);
  }

  visitPsakTHNode(node: PsakTHNode) {
    const attributes = [];

    const value = node[':@']?.['@_value'] ?? undefined;
    const styleClass = node[':@']?.['@_styleClass'] ?? undefined;
    const rendered = node[':@']?.['@_rendered'] ?? undefined;

    if (styleClass !== undefined) {
      attributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('className'),
          ts.factory.createStringLiteral(styleClass),
        ),
      );
    }

    const children = [];
    if (value !== undefined) {
      this.withStringShouldBeJSX(() => {
        children.push(this.handleText(value));
      });
    }

    // Camel-case the navValue
    const name = 'th';

    // <psak:th>something</psak:th> should be converted into <th>something</th>
    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier(name),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier(name)),
    );
    this.handleRenderedProp(rendered);
  }

  visitPsakTDNode(node: PsakTDNode) {
    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['psak:td']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    const attributes = [];
    const styleClass = node[':@']?.['@_styleClass'] ?? undefined;
    const rowspan = node[':@']?.['@_rowspan'] ?? undefined;
    const rendered = node[':@']?.['@_rendered'] ?? undefined;

    if (styleClass !== undefined) {
      attributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('className'),
          ts.factory.createStringLiteral(styleClass),
        ),
      );
    }

    if (rowspan !== undefined) {
      attributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('rowSpan'),
          ts.factory.createStringLiteral(rowspan),
        ),
      );
    }

    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('td'),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('td')),
    );
    this.handleRenderedProp(rendered);
  }

  visitPsakPhoneNumberOutputNode(node: PsakPhoneNumberOutputNode) {
    const id = node[':@']?.['@_id'] ?? undefined;
    const isMobileNumber = node[':@']?.['@_isMobileNumber'] ?? undefined;
    const phoneNumber = node[':@']?.['@_phoneNumber'] ?? undefined;
    const rendered = node[':@']?.['@_rendered'] ?? undefined;

    // Return <PhoneNumberOutput id="the-id" isMobileNumber="true" phoneNumber="the-phone-number" />
    const tagName = 'PhoneNumberOutput';
    const attributes = [];
    if (id !== undefined) {
      attributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('id'),
          ts.factory.createStringLiteral(id),
        ),
      );
    }
    if (isMobileNumber !== undefined) {
      attributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('isMobileNumber'),
          ts.factory.createStringLiteral(isMobileNumber),
        ),
      );
    }
    if (phoneNumber !== undefined) {
      attributes.push(
        ts.factory.createJsxAttribute(
          ts.factory.createIdentifier('phoneNumber'),
          ts.factory.createStringLiteral(phoneNumber),
        ),
      );
    }
    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(tagName),
      undefined,
      ts.factory.createJsxAttributes(attributes),
    );
    this.handleRenderedProp(rendered);
  }

  visitNavWCNode(node: NavWebComponentNode) {
    // Loop through all the node keys, get the first one that matches nav:<something> and then extract <something> into a variable.
    const navKey = Object.keys(node).find((key) => key.startsWith('wc:'));
    const navValue = navKey?.replace(/^wc:/, '');
    if (navValue === undefined) {
      throw new Error('Could not find wc tag');
    }

    // Camel-case the navValue
    const name = navValue.replace(/(?:^|-)(.)/g, (_, x) => x.toUpperCase());

    // For example <wc:some-component> should be converted into <SomeComponent>
    this.result = ts.factory.createJsxSelfClosingElement(
      ts.factory.createIdentifier(name),
      undefined,
      ts.factory.createJsxAttributes([]),
    );
  }

  visitDiv(node: DivNode) {
    const attributes = [];
    let rendered;

    for (const [key, value] of Object.entries(node[':@'] ?? {})) {
      if (key === '@_id') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('id'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value))
          ),
        );
      } else if (key === '@_forceId') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('data-unknown-attribute-forceId'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_title') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('title'),
            this.handleText(value, true),
          ),
        );
      } else if (key === '@_styleClass') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('className'),
            spelOrStringLiteral(value, true),
            // ts.factory.createJsxExpression(undefined, spelOrStringLiteral(value))
          ),
        );
      } else if (key === '@_style') {
        const parsedStyle = this.cssStringToReact(value);
        attributes.push(
          this.makeStyleJsxAttribute(parsedStyle)
        );
      } else if (key === '@_width') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('width'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_onclick') {
        attributes.push(
          ts.factory.createJsxAttribute(
            ts.factory.createIdentifier('onClick'),
            ts.factory.createStringLiteral(value),
          ),
        );
      } else if (key === '@_rendered') {
        rendered = value;
      } else {
        throw new Error('Unexpected attribute in div: ' + key);
      }
    }

    const children = [];
    this.withStringShouldBeJSX(() => {
      for (const child of node['t:div']) {
        this.visit(child);
        children.push(this.result);
      }
    });

    this.result = ts.factory.createJsxElement(
      ts.factory.createJsxOpeningElement(
        ts.factory.createIdentifier('div'),
        undefined,
        ts.factory.createJsxAttributes(attributes),
      ),
      children,
      ts.factory.createJsxClosingElement(ts.factory.createIdentifier('div')),
    );
    this.handleRenderedProp(rendered);
  }
}
