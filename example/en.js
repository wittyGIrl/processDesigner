var langType = {
    ui: {
      command: {
        redo: 'redo',
        undo: 'undo',
        //添加节点
        AppendRootNode: {
          startEvent: 'startEvent',
          endEvent: 'endEvent',

          //activity.task
          userTask: 'userTask',
          scriptTask: 'scriptTask',
          loopTask: 'loopTask',
          sendTask: 'sendTask',
          calledElement: 'calledElement',
          callActivity: 'callActivity',
          restServiceTask : 'restServiceTask',
          //gateway
          gateway: 'gateway',
          exclusiveGateway: 'exclusiveGateway',
          inclusiveGateway: 'inclusiveGateway',
          //data
          dataInput: 'dataInput',
          dataOutput: 'dataOutput',


        },
        AppendChildNode: {
          timerEventDefinition: 'timerEventDefinition',
        },
        property: 'property',
        opertion: 'opertion',
        remove: 'remove',
        align: 'align',
        alignx: 'alignX',
        aligny: 'alignY'
      },
      menu: {
        mainmenutext: 'rocessDesigner',
        history: 'Draft',
        shortkey: 'shortkey'
      },

      recent: {
        clearrecent: 'Clear All Draft',
        draftCreateTime: 'draftCreateTime{0}',
        draftUpdateTime: 'draftUpdateTime ',
        loadDraft: 'loadDraft',

        noticeTitle: 'noticeTitle',
        noticeBody: 'the drafts are form auto save or Use "Ctrl+S",do not saved in the process packaged,they are provide convinent for users.'
      },
      shortkey: {
        keys: [
          {text: 'Ctrl + C', value: 'copy'},
          {text: 'Ctrl + X', value: 'cut'},
          {text: 'Ctrl + V', value: 'paste'},
          {text: 'Ctrl + Z', value: 'undo'},
          {text: 'Ctrl + Y', value: 'redo'},
          {text: 'Ctrl + click', value: 'multiple choose'},
          {text: 'Mouse Right / Alt + Mouse Left', value: 'drag canvas'},
          {text: 'Delete', value: 'delete'},
          {text: 'up down left right', value: 'change to check'}
        ]
      },

      justnow: 'justnow',
      minutesago: '{0} minutesago',
      hoursago: '{0} hoursago',
      yesterday: 'yesterday',
      daysago: '{0} daysago',
      longago: 'longago',

      status: {
        ready: 'ready',
        autoSave: 'ready',
        localStore: 'error connecting,saved has been store on the local',
        autoSaveError: 'error service connected,saved has been store on the local',
        draftStatus: 'content comes from draft,click to delete it',
        draftHint: 'click to delete draft。'
      },

      tabs: {
        node: 'node',
        appearence: 'appearence',
        view: 'view'
      },
      panels: {
        property: 'property'
      },
      hand: 'hand',
      camera: 'checking',
      'zoom-in': 'zoom-in', //（Ctrl+）
      'zoom-out': 'zoom-out', //（Ctrl-）
      navigator: 'navigator',
      quickvisit: {
        save: 'save',
        deploy: 'deploy',
        deployNewVersion: 'deployNewVersion'
      },
      note: 'note',
      removenote: 'removenote'
    },
    //propertygrid
    node: {
      property: {
        basic: 'basic property',
        element: 'element property',
        graphic: 'graphic property',
        dataInput: 'dataInput',
        dataOutput: 'dataOutput',

        actions: 'actions',
        form: 'form',
        conditions: 'conditions',
        extension: 'extension',
        presentation: 'presentation'
      }
    },
    message: {
      missingNameMessage: 'please input {0} name',
      missingIdMessage: 'please input{0} ID',
      ASCIIMessage: 'please input number or word as the same time do not begaining in number',
      actionCannotRemove:'please delete linked lines',
      pinsCannotChange: 'please delete linked lines,change the lines',
    },
    //定义属性页
    tabs: {
      basic: 'basic',
      policies: 'policies',
      form: 'form',
    //  dataInputAssociation: '关联数据',
      dataInputAssociations: 'dataInputAssociations',
      eventNotifications: 'eventNotifications',
      notifications: 'notifications',
      notification: 'notification'
    },
    label: {
      details: 'details',
      choice : 'choice',
      formChoice: 'please select the form',
      otherForm: 'can not support the form design by programed',
    },
    property: {
      process: 'process',
      //node
      userTask: 'userTask',
      scriptTask: 'scriptTask',
      loopTask: 'loopTask',
      endEvent: 'endEvent',
      startEvent: 'startEvent',
      terminateEndEvent: 'terminateEndEvent',
      gateway: 'gateway',
      exclusiveGateway: 'exclusiveGateway',
      inclusiveGateway: 'inclusiveGateway',

      //common
      name: 'name',
      terminateProcessWhenRejected: 'terminateProcessWhenRejected',
      humanPerformer: 'humanPerformer',
      formRight: 'formRight',
      fieldRightSet:'fieldRightSet',
      fieldRight: 'fieldRight',
      potentialOwner: 'potentialOwner',
      callActivity: 'callActivity',
      restServiceTask : 'restServiceTask',
      calledElement: 'calledElement',
      calledBindingVersion: 'calledBindingVersion',
      performerType: 'performerType',
      handleNumber:'handleNumber',
      completionCondition:'completionCondition',
      displayName: 'displayName',
      extensionElements: 'extensionElements',
      script: 'script',
      cycleDuration: 'cycleDuration',
      isLoop:'isLoop',
      note: 'note',
      pins: 'pins',
      cancelActivity: 'cancelActivity',
      loopTask: 'loopTask',
      or: 'or',
      dataSet: 'dataSet',
      sourceRef: 'sourceRef',
      targetRef: 'targetRef',
      implementation:'implementation',
      operationRef:'operationRef',
      returnType:'returnType',
      timeout:'timeout',
      serviceUsername:'serviceUsername',
      password:'password',

      //form
      form: 'form',
      path: 'path',
      attachmentRight: 'attachmentRight',
      block: 'block',
      formActionSet: 'formActionSet',
      formActionGroup: 'formActionGroup',

      formAction: 'formAction',
      type: 'type',
      addSignApproveType: 'addSignApproveType',

      //通知
      eventNotifications: 'eventNotifications',
      eventNotification: 'eventNotification',
      event: 'event',
      priority: 'priority',
      notificationRef: 'notificationRef',
      notifications: 'notifications',
      notification: 'notification',
      recipients: 'recipients',
      ccs: 'copy to',
      bccs: 'bccs',

      //presentation
      presentationElements: 'show',
      subject: 'theme',
      lang: 'language',
      text: 'text',
      description: 'description',

      //io
      ioSpecification: 'ioSpecification',
      inputSet: 'inputSet',
      optional:'required',
      dataInput: 'dataInput',
      outputSet: 'outputSet',
      dataOutput: 'dataOutput',
      itemSubjectRef: 'type',
      itemSubject:'itemSubject',
      dataInputAssociation: 'dataInputAssociation',
      dataInputAssociations: 'dataInputAssociations',

      //line
      sequenceFlow: 'sequenceFlow',
      conditionExpression: 'conditionExpression',

      //policy
      policies: 'policies',
      bypass: 'bypass the current node',
      bypassWhenParticipantIsNull: 'bypass when there are not handler',
      bypassWhenParticipantIsStartUser: 'bypass when the handle  same as submitter',
      bypassWhenParticipantSameAsPreviousTask: 'bypass when The handler  same as previous step',
      bypassWhenParticipantProcessed: 'bypass when The handler  same as any previous step',
      return: 'action',
      enableReturn: 'permit return current node',
      executeReturn: 'permit execute return',
      executeSuspend: 'permit execute suspend',
      executeTerminate: 'permit execute termina',
      executeRestart: 'permit execute restart',

      //eventDefinition
      timeDuration: 'timeDuration',
      timeCycle: 'timeCycle',

      //multiInstanceLoopCharacteristics
      multiInstanceLoopCharacteristics: 'loop task',
      isSequential: 'isSequential',

      //error
      "ResourceRole": 'ResourceRole'
    }
  };
