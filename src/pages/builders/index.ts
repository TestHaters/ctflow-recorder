import { getBestSelectorForAction, getSelectorsForAction } from './selector';

import type { Action } from '../types';
import {
  ActionType,
  BaseAction,
  ScriptType,
  TagName,
  isSupportedActionType,
} from '../types';

const FILLABLE_INPUT_TYPES = [
  '',
  'date',
  'datetime',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
];

import { v4 as uuid } from 'uuid';

// only used in ActionContext
export const truncateText = (str: string, maxLen: number) => {
  return `${str.substring(0, maxLen)}${str.length > maxLen ? '...' : ''}`;
};

export const isActionStateful = (action: Action) => {
  return action.tagName === TagName.TextArea;
};

type ActionState = {
  causesNavigation: boolean;
  isStateful: boolean;
};

export class ActionContext extends BaseAction {
  private readonly action: Action;

  private readonly scriptType: ScriptType;

  private readonly actionState: ActionState;

  constructor(
    action: Action,
    scriptType: ScriptType,
    actionState: ActionState
  ) {
    super();
    this.action = action;
    this.actionState = actionState;
    this.scriptType = scriptType;
    console.log('INIT ACTION CONTEXT');
  }

  getType() {
    return this.action.type;
  }

  getTagName() {
    return this.action.tagName;
  }

  getValue() {
    return this.action.value;
  }

  getInputType() {
    return this.action.inputType;
  }

  getAction() {
    return this.action;
  }

  getActionState() {
    return this.actionState;
  }

  getDescription() {
    const { type, selectors, tagName, value } = this.action;

    switch (type) {
      case ActionType.Click:
        console.log('description for click action');
        return `Click on <${tagName.toLowerCase()}> ${
          selectors.text != null && selectors.text.length > 0
            ? `"${truncateText(selectors.text.replace(/\s/g, ' '), 25)}"`
            : getBestSelectorForAction(this.action, this.scriptType)
        }`;
      case ActionType.Hover:
        return `Hover over <${tagName.toLowerCase()}> ${
          selectors.text != null && selectors.text.length > 0
            ? `"${truncateText(selectors.text.replace(/\s/g, ' '), 25)}"`
            : getBestSelectorForAction(this.action, this.scriptType)
        }`;
      case ActionType.Input:
        return `Fill ${truncateText(
          JSON.stringify(value ?? ''),
          16
        )} on <${tagName.toLowerCase()}> ${getBestSelectorForAction(
          this.action,
          this.scriptType
        )}`;
      case ActionType.Keydown:
        return `Press ${this.action.key} on ${tagName.toLowerCase()}`;
      case ActionType.Load:
        return `Load "${this.action.url}"`;
      case ActionType.Resize:
        return `Resize window to ${this.action.width} x ${this.action.height}`;
      case ActionType.Wheel:
        return `Scroll wheel by X:${this.action.deltaX}, Y:${this.action.deltaY}`;
      case ActionType.FullScreenshot:
        return `Take full page screenshot`;
      case ActionType.AwaitText:
        return `Wait for text ${truncateText(
          JSON.stringify(this.action.text),
          25
        )} to appear`;
      case ActionType.DragAndDrop:
        return `Drag n drop ${getBestSelectorForAction(
          this.action,
          this.scriptType
        )} from (${this.action.sourceX}, ${this.action.sourceY}) to (${
          this.action.targetX
        }, ${this.action.targetY})`;
      default:
        return '';
    }
  }

  getBestSelector(): string | null {
    return getBestSelectorForAction(this.action, this.scriptType);
  }

  getAlternativeSelectors(): string[] {
    return [];
  }

  getSelectors(): (null | string)[] {
    return getSelectorsForAction(this.action, this.scriptType);
  }
}

export abstract class ScriptBuilder {
  protected readonly codes: string[];

  protected readonly actionContexts: ActionContext[];

  protected readonly showComments: boolean;

  // we use this variable to keep track which is current actionContext is used to generate code.
  protected currentActionContextIndex: number;

  constructor(showComments: boolean) {
    this.codes = [];
    this.actionContexts = [];
    this.showComments = showComments;
  }

  abstract click: (
    selectors: (null | string)[],
    causesNavigation: boolean,
    description: string
  ) => this;

  abstract hover: (
    selectors: (null | string)[],
    causesNavigation: boolean,
    description: string
  ) => this;

  abstract load: (url: string, description: string) => this;

  abstract resize: (width: number, height: number, description: string) => this;

  abstract fill: (
    selectors: (null | string)[],
    value: string,
    causesNavigation: boolean,
    description: string
  ) => this;

  abstract type: (
    selectors: (null | string)[],
    value: string,
    causesNavigation: boolean,
    description: string
  ) => this;

  abstract keydown: (
    selectors: (null | string)[],
    key: string,
    causesNavigation: boolean,
    description: string
  ) => this;

  abstract select: (
    selectors: (null | string)[],
    key: string,
    causesNavigation: boolean,
    description: string
  ) => this;

  abstract wheel: (
    deltaX: number,
    deltaY: number,
    pageXOffset?: number,
    pageYOffset?: number,
    description?: string
  ) => this;

  abstract dragAndDrop: (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    description: string
  ) => this;

  abstract fullScreenshot: () => this;

  abstract awaitText: (test: string) => this;

  abstract buildScript: () => string;

  private transformActionIntoCodes = (actionContext: ActionContext) => {
    // if (this.showComments) {
    //   const actionDescription = actionContext.getDescription();
    //   // this.pushComments(`// ${actionDescription}`);
    //   // Don't push description
    // }

    const actionDescription = actionContext.getDescription();

    console.log('build code: Action Context', actionContext);

    // const bestSelector = actionContext.getBestSelector();
    const selectors = actionContext.getSelectors();
    const tagName = actionContext.getTagName();
    const value = actionContext.getValue();
    const inputType = actionContext.getInputType();
    const { causesNavigation } = actionContext.getActionState();
    // (FIXME: getters for special fields)
    const action: any = actionContext.getAction();

    switch (actionContext.getType()) {
      case ActionType.Click:
        // this.click(bestSelector as string, causesNavigation);
        this.click(selectors, causesNavigation, actionDescription);
        break;
      case ActionType.Hover:
        this.hover(selectors, causesNavigation, actionDescription);
        break;
      case ActionType.Keydown:
        this.keydown(
          selectors,
          action.key ?? '',
          causesNavigation,
          actionDescription
        );
        break;
      case ActionType.Input: {
        if (tagName === TagName.Select) {
          this.select(
            selectors,
            value ?? '',
            causesNavigation,
            actionDescription
          );
        } else if (
          // If the input is "fillable" or a text area
          tagName === TagName.Input &&
          inputType != null &&
          FILLABLE_INPUT_TYPES.includes(inputType)
        ) {
          // Do more actionability checks
          this.fill(
            selectors,
            value ?? '',
            causesNavigation,
            actionDescription
          );
        } else if (tagName === TagName.TextArea) {
          this.fill(
            selectors,
            value ?? '',
            causesNavigation,
            actionDescription
          );
        } else {
          this.type(
            selectors,
            value ?? '',
            causesNavigation,
            actionDescription
          );
        }
        break;
      }
      case ActionType.Load:
        this.load(action.url, actionDescription);
        break;
      case ActionType.Resize:
        this.resize(action.width, action.height, actionDescription);
        break;
      case ActionType.Wheel:
        this.wheel(
          action.deltaX,
          action.deltaY,
          action.pageXOffset,
          action.pageYOffset,
          actionDescription
        );
        break;
      case ActionType.FullScreenshot:
        this.fullScreenshot();
        break;
      case ActionType.AwaitText:
        this.awaitText(action.text);
        break;
      case ActionType.DragAndDrop:
        this.dragAndDrop(
          action.sourceX,
          action.sourceY,
          action.targetX,
          action.targetY,
          actionDescription
        );
        break;
      default:
        break;
    }
  };

  protected pushComments = (comments: string) => {
    this.codes.push(`\n  ${comments}`);
    return this;
  };

  protected pushCodes = (codes: string) => {
    this.codes.push(`${codes}\n`);
    return this;
  };

  pushActionContext = (actionContext: ActionContext) => {
    this.actionContexts.push(actionContext);
  };

  buildCodes = () => {
    let prevActionContext: ActionContext | undefined;

    // stateful = Textarea?
    //  I don't get these code, if I don't comment out these line, the fill into textarea will not work
    for (const actionContext of this.actionContexts) {
      // if (!actionContext.getActionState().isStateful) {
      //   if (
      //     prevActionContext !== undefined &&
      //     prevActionContext.getActionState().isStateful
      //   ) {
      //     console.log("the previous is not stateful and current is not stateful")
      //     this.transformActionIntoCodes(prevActionContext);
      //   }
      //   this.transformActionIntoCodes(actionContext);
      // }
      this.transformActionIntoCodes(actionContext);
      prevActionContext = actionContext;
    }

    // edge case
    if (
      prevActionContext !== undefined &&
      prevActionContext.getActionState().isStateful
    ) {
      this.transformActionIntoCodes(prevActionContext);
    }
    return this;
  };

  // for test
  getLatestCode = () => this.codes[this.codes.length - 1];
}

export class CypressScriptBuilder extends ScriptBuilder {
  // constructor = (showComments: boolean) {

  //   super(showComments)
  // }
  private readonly uuids: string[];

  constructor(showComments: boolean) {
    console.log('REINIT CYPRESS SCRIPTBUIDLER');
    super(showComments);
    this.uuids = [];
  }

  findOrCreateId() {
    return uuid();
    const currentActionContext =
      this.actionContexts[this.currentActionContextIndex];
    let currentAction = currentActionContext.getAction();

    console.log(
      'currentAction Timestamp',
      currentAction.timestamp,
      currentAction
    );
    return String(currentAction.timestamp || Math.random());
  }

  // Cypress automatically detects and waits for the page to finish loading
  click = (
    selectors: (null | string)[],
    causesNavigation: boolean,
    description: string
  ) => {
    // this.pushCodes(`cy.get('${selector}').click();`);
    const id = this.findOrCreateId();
    this.pushCodes(`
  ${id}:
    id: ${id}
    position:
      x: 0
      y: 0
    type: buttonNode
    description: ${description}
    componentName: compName
    outputQ:
      - outputQ
    inPorts:
      field: '${selectors[0] as string}'
      alternative_selectors: ${selectors
        .slice(1)
        .map((x) => `\n        - '${x}'`)
        .join('')}
    outPorts: {}
    data: {}`);

    return this;
  };

  hover = (
    selectors: (null | string)[],
    causesNavigation: boolean,
    description: string
  ) => {
    // this.pushCodes(`cy.get('${selector}').trigger('mouseover');`);
    return this;
  };

  load = (url: string, description: string) => {
    // this.pushCodes(`cy.visit('${url}');`);

    const id = this.findOrCreateId();
    this.pushCodes(`
  ${id}:
    id: ${id}
    position:
      x: 0
      y: 0
    type: visitNode
    description: ${description}
    componentName: compName
    outputQ:
      - outputQ
    inPorts:
      url: ${url}
    outPorts: {}
    data: {}`);
    return this;
  };

  resize = (width: number, height: number, description: string) => {
    // this.pushCodes(`cy.viewport(${width}, ${height});`);
    return this;
  };

  fill = (
    selectors: (null | string)[],
    value: string,
    causesNavigation: boolean,
    description: string
  ) => {
    // this.pushCodes(`cy.get('${selector}').type(${JSON.stringify(value)});`);

    const id = this.findOrCreateId();
    this.pushCodes(`
  ${id}:
    id: ${id}
    position:
      x: 0
      y: 0
    type: textInputType
    description: ${description}
    componentName: compName
    outputQ:
      - outputQ
    inPorts:
      field: '${selectors[0] as string}'
      alternative_selectors: ${selectors
        .slice(1)
        .map((x) => `\n        - '${x}'`)
        .join('')}
      value: ${JSON.stringify(value)}
    outPorts: {}
    data: {}`);
    return this;
  };

  type = (
    selectors: (null | string)[],
    value: string,
    causesNavigation: boolean,
    description: string
  ) => {
    // this.pushCodes(`cy.get('${selector}').type(${JSON.stringify(value)});`);
    return this;
  };

  select = (
    selectors: (null | string)[],
    option: string,
    causesNavigation: boolean,
    description: string
  ) => {
    // this.pushCodes(`cy.get('${selector}').select('${option}');`);
    return this;
  };

  keydown = (
    selectors: (null | string)[],
    key: string,
    causesNavigation: boolean,
    description: string
  ) => {
    // this.pushCodes(`cy.get('${selector}').type('{${key}}');`);
    return this;
  };

  wheel = (
    deltaX: number,
    deltaY: number,
    pageXOffset?: number,
    pageYOffset?: number
  ) => {
    // this.pushCodes(
    //   `cy.scrollTo(${Math.floor(pageXOffset ?? 0)}, ${Math.floor(
    //     pageYOffset ?? 0
    //   )});`
    // );
    return this;
  };

  fullScreenshot = () => {
    // this.pushCodes(`cy.screenshot();`);
    return this;
  };

  awaitText = (text: string) => {
    // this.pushCodes(`cy.contains('${text}');`);
    return this;
  };

  dragAndDrop = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number
  ) => {
    // TODO -> IMPLEMENT ME
    // this.pushCodes('');
    return this;
  };

  buildScript = () => {
    // return `it('Written with DeploySentinel Recorder', () => {${this.codes.join(
    //   ''
    // )}});`;

    // from this.codes, split to pairs of 2
    // For example [1,2,3,4] -> [[1,2], [2,3], [3,4]]
    const pairs = this.codes
      .slice(0, -1)
      .map((node, index) => [node, this.codes[index + 1]]);

    // For each pair, create an edge
    const edges = pairs.map(([node, nextNode]) => {
      const sourceId = node.split(':')[0].trim();
      const targetId = nextNode.split(':')[0].trim();
      const id = sourceId + '_' + targetId;
      return `
  ${id}:
    id: ${id}
    source: ${sourceId}
    sourceHandle: null
    target: ${targetId}
    targetHandle: null
    type: customEdge
    `;
    });

    return `nodes:${this.codes.join('')}\nedges: ${edges.join('\n')}`;
  };
}

export const genCode = (
  actions: Action[],
  showComments: boolean,
  scriptType: ScriptType
): string => {
  let scriptBuilder: ScriptBuilder;

  switch (scriptType) {
    case ScriptType.Cypress:
      scriptBuilder = new CypressScriptBuilder(showComments);
      break;
    default:
      throw new Error('Unsupported script type');
  }

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];

    if (!isSupportedActionType(action.type)) {
      continue;
    }

    const nextAction = actions[i + 1];
    const causesNavigation = nextAction?.type === ActionType.Navigate;

    scriptBuilder.pushActionContext(
      new ActionContext(action, scriptType, {
        causesNavigation,
        isStateful: isActionStateful(action),
      })
    );
  }

  return scriptBuilder.buildCodes().buildScript();
};
