var langType = {
    ui: {
      command: {
        redo: '重做',
        undo: '撤销',
        //添加节点
        AppendRootNode: {
          startEvent: '开始节点',
          endEvent: '结束节点',

          //activity.task
          userTask: '用户任务',
          scriptTask: '脚本任务',
          loopTask: '循环任务',
          sendTask: '通知任务',
          calledElement: '子流程',
          callActivity: '子流程',
          restServiceTask : '其他服务',
          //gateway
          gateway: '网关',
          exclusiveGateway: '互斥网关',
          inclusiveGateway: '相容网关',
          //data
          dataInput: '数据输入',
          dataOutput: '数据输出',


        },
        AppendChildNode: {
          timerEventDefinition: '定时器',
        },
        property: '属性',
        opertion: '操作',
        remove: '删除',
        align: '排列',
        alignx: '垂直对齐',
        aligny: '水平对齐'
      },
      menu: {
        mainmenutext: '流程设计器',
        history: '草稿记录',
        shortkey: '快捷键'
      },

      recent: {
        clearrecent: '清除全部草稿',
        draftCreateTime: '创建于{0}',
        draftUpdateTime: '最后更新于 ',
        loadDraft: '还原此草稿',

        noticeTitle: '草稿是什么？',
        noticeBody: '草稿是在自动保存或者 “Ctrl+s” 后产生的结果，并没有真正保存到流程包中。这样可以更好地保障用户的操作结果不丢失，同时在不需要的时候也可以方便的舍弃。'
      },
      shortkey: {
        keys: [
          {text: 'Ctrl + C', value: '复制'},
          {text: 'Ctrl + X', value: '剪切'},
          {text: 'Ctrl + V', value: '粘贴'},
          {text: 'Ctrl + Z', value: '撤销'},
          {text: 'Ctrl + Y', value: '重做'},
          {text: 'Ctrl + 鼠标左键', value: '多选'},
          {text: '鼠标右键 / Alt + 鼠标左键', value: '拖拽画布'},
          {text: 'Delete', value: '删除'},
          {text: '上 下 左 右', value: '切换选中节点'}
        ]
      },

      justnow: '刚刚',
      minutesago: '{0} 分钟前',
      hoursago: '{0} 小时前',
      yesterday: '昨天',
      daysago: '{0} 天前',
      longago: '很久之前',

      status: {
        ready: '准备就绪',
        autoSave: '所有更改已经自动保存在服务器',
        localStore: '网络断开，所有更改已经自动保存在本地。',
        autoSaveError: '服务器自动保存出错，更改已经自动保存在本地。',
        draftStatus: '当前内容来自草稿，点击这里丢弃草稿',
        draftHint: '点击后丢弃草稿，直接显示流程包中的内容。'
      },

      tabs: {
        node: '节点',
        appearence: '外观',
        view: '视图'
      },
      panels: {
        property: '属性'
      },
      hand: '允许拖拽',
      camera: '居中选中节点',
      'zoom-in': '放大', //（Ctrl+）
      'zoom-out': '缩小', //（Ctrl-）
      navigator: '导航',
      quickvisit: {
        save: '保存',
        deploy: '发布到当前版本',
        deployNewVersion: '发布到新版本'
      },
      note: '备注',
      removenote: '移除已有备注'
    },
    //propertygrid
    node: {
      property: {
        basic: '基本属性',
        element: '节点属性',
        graphic: '图形属性',
        dataInput: '数据输入',
        dataOutput: '数据输出',

        actions: '操作',
        form: '表单',
        conditions: '条件',
        extension: '拓展属性',
        presentation: '展现(定义主题、描述)(可选)'
      }
    },
    message: {
      missingNameMessage: '请输入{0}的名称',
      missingIdMessage: '请输入{0}的ID',
      ASCIIMessage: '请输入英文字母或数字，且不能以数字开头',
      actionCannotRemove:'请先删除此动作对应引脚的连线',
      pinsCannotChange: '请先删除该节点开始的线，再切换连线方式',
    },
    //定义属性页
    tabs: {
      basic: '基本属性',
      policies: '策略',
      form: '表单',
    //  dataInputAssociation: '关联数据',
      dataInputAssociations: '数据集',
      eventNotifications: '通知',
      notifications: '通知模板',
      notification: '通知模板'
    },
    label: {
      details: '查看详细',
      choice: '选择',
      formChoice: '请选择表单',
      otherForm: '暂不支持自定义表单',
    },
    property: {
      process: '流程',
      //node
      userTask: '用户任务',
      scriptTask: '脚本任务',
      loopTask: '循环任务',
      endEvent: '结束节点',
      startEvent: '开始节点',
      terminateEndEvent: '终止结束节点',
      gateway: '网关',
      exclusiveGateway: '互斥网关',
      inclusiveGateway: '包含网关',

      //common
      name: '名称',
      terminateProcessWhenRejected: '拒绝后终止流程',
      humanPerformer: '处理人',
      formRight: '表单权限控制',
      "fieldRightSet":'表单权限控制',
      "fieldRight": '表单权限控制',
      potentialOwner: '处理人',
      callActivity: '子流程',
      restServiceTask : '其他服务',
      calledElement: '子流程',
      calledBindingVersion: '使用版本',
      performerType: '处理策略',
      handleNumber:'需要审批人数',
      completionCondition:'终止条件',
      displayName: '显示名',
      extensionElements: '拓展属性',
      script: '脚本',
      cycleDuration: '循环间隔',
      isLoop:'循环',
      note: '备注',
      pins: '使用引脚',
      cancelActivity: '结束任务',
      loopTask: '循环任务',
      or: '或者',
      dataSet: '数据集',
      sourceRef: '源数据',
      targetRef: '目标数据',
      implementation:'启用目标',
      operationRef:'操作类型',
      returnType:'返回类型',
      timeout:'超时',
      serviceUsername:'用户名',
      password:'密码',

      //form
      form: '表单',
      path: '表单路径',
      attachmentRight: '附件权限',
      block: '区域块',
      formActionSet: '表单操作',
      formActionGroup: '表单操作组',

      formAction: '表单操作',
      type: '类型',
      addSignApproveType: '加签类型',

      //通知
      eventNotifications: '设置通知',
      eventNotification: '通知',
      event: '事件',
      priority: '优先级',
      notificationRef: '通知模板',
      notifications: '设置通知模板',
      notification: '通知模板',
      recipients: '接收人',
      ccs: '抄送',
      bccs: '密送',

      //presentation
      presentationElements: '展现',
      subject: '主题',
      lang: '语言',
      text: '内容',
      description: '描述',

      //io
      ioSpecification: '输入输出',
      inputSet: '输入集',
      optional:'必填',
      dataInput: '数据输入',
      outputSet: '输出集',
      dataOutput: '数据输出',
      itemSubjectRef: '数据类型',
      itemSubject:'数据类型',
      dataInputAssociation: '关联数据',
      dataInputAssociations: '数据集',

      //line
      sequenceFlow: '线',
      conditionExpression: '流转条件',

      //policy
      policies: '策略',
      bypass: '跳过当前节点',
      bypassWhenParticipantIsNull: '无对应处理人时跳过',
      bypassWhenParticipantIsStartUser: '处理人就是提交人时跳过',
      bypassWhenParticipantSameAsPreviousTask: '处理人与前一步骤处理人相同时跳过',
      bypassWhenParticipantProcessed: '处理人与前面任一步骤处理人相同时跳过',
      return: '动作',
      enableReturn: '允许退回到当前节点',
      executeReturn: '允许执行退回',
      executeSuspend: '允许执行挂起',
      executeTerminate: '允许执行终止',
      executeRestart: '允许执行重启',

      //eventDefinition
      timeDuration: '时间间隔',
      timeCycle: '循环周期',

      //multiInstanceLoopCharacteristics
      multiInstanceLoopCharacteristics: '循环任务',
      isSequential: '顺序执行',

      //error
      "ResourceRole": '处理人'
    }
  };
