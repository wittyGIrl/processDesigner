(function () {
  window.KITYMINDER_CONFIG = {
          // 定义
          //modules: [],

          // 只读模式，默认是false
          readOnly: false,

          // 默认主题
          defaultTemplate: 'default',

          // 默认皮肤
          defaultTheme: 'default',

          // 最大可回退的次数，默认 20
          maxUndoCount: 20,

          // 语言，默认是 'zh-cn'
          lang: 'zh-cn',

          // 配置放大缩小的比例
          zoom: [30, 50, 80, 100, 120, 150, 200], //10, 20,

          // 图片尺寸限制
          maxImageWidth: 200,
          maxImageHeight: 200,

          // 修改后自动保存时间间隔（单位：秒）；设置为 false 不自动保存
          autoSaveDuration: 10,


          //combobox 中的选项设置
          optMethod: [{
              value: 'PUT',
              text: 'PUT'
          }, {
              value: 'GET',
              text: 'GET'
          }, {
              value: 'POST',
              text: 'POST'
          }, {
              value: 'DELETE',
              text: 'DELETE'
          }],
          returnType: [{
              value: 'string',
              text: 'string'
          }, {
              value: 'int',
              text: 'int'
          }, {
              value: 'boolean',
              text: 'boolean'
          }, {
              value: 'datetime',
              text: 'datetime'
          }, {
              value: 'xml',
              text: 'xml'
          }, {
              value: 'json',
              text: 'json'
          }],
          dataType: [{
              value: 'xsd:int',
              text: 'int'
          }, {
              value: 'xsd:string',
              text: 'string'
          }, {
              value: 'xsd:decimal',
              text: 'decimal'
          }, {
              value: 'xsd:boolean',
              text: 'bool'
          }, {
              value: 'xsd:datetime',
              text: 'datetime'
          }],
          formActions: [{
              value: 'approve',
              text: 'approve'
          }, {
              value: 'reject',
              text: 'reject'
          }, {
              value: 'assign',
              text: 'assign'
          }, {
              value: 'countersign',
              text: 'countersign'
          }, {
              value: 'addsign',
              text: 'addsign(包含前加签，并加签，后加签)'
          }, {
              value: 'addsignbefore',
              text: 'addsignbefore'
          }, {
              value: 'addsignparallel',
              text: 'addsignparallel'
          }, {
              value: 'addsignafter',
              text: 'addsignafter'
          }, {
              value: 'approve4addsign',
              text: 'approve4addsign(加签)'
          }, {
              value: 'reject4addsign',
              text: 'reject4addsign(加签)'
          }],
          addSignApproveTypes: [{
              value: '0',
              text: '全部加签人员审批完成后向下流转'
          }, {
              value: '1',
              text: '加签人员一人审批完成后即向下流转'
          }, {
              value: '2',
              text: '选中加签人员需按顺序审批'
          }],
          targetValues: [
            'addsign', 'addsignbefore', 'addsignparallel', 'addsignafter'
          ],
          //必选语言项
          requiredLangType: [{
              value: 'en',
              text: 'English'
          }, {
              value: 'zh-cn',
              text: 'zh-cn'
          }, {
              value: 'zh-tw',
              text: 'zh-tw'
          }],
          //非必选的语言项
          langType: [{
              value: '',
              text: 'please choose'
          }, {
              value: 'en',
              text: 'English'
          }, {
              value: 'zh-cn',
              text: 'zh-cn'
          }, {
              value: 'zh-tw',
              text: 'zh-tw'
          }],
          // 表单中默认的action
          defaultActions: [{
              name: 'Reject',
              type: 'reject',
              displayName: '{"zh-cn": "拒绝", "en": "Reject", "zh-tw":"拒絕"}'
          }, {
              name: 'Approve',
              type: 'approve',
              displayName: '{"zh-cn": "同意", "en": "Approve", "zh-tw":"同意"}'
          }],

          priorityType: [{
              value: '',
              text: 'please choose'
          }, {
              value: 0,
              text: 'highest'
          }, {
              value: 1,
              text: 'high'
          }, {
              value: 2,
              text: 'ordinary'
          }, {
              value: 3,
              text: 'low'
          }, {
              value: 4,
              text: 'lowest'
          }],
          attachmentRightType: {
              count: 4,
              options: [{
                  key: 0,
                  text: 'readRight',
              }, {
                  key: 1,
                  text: 'addRight', //'编辑权限',
              }, {
                  key: 3,
                  text: 'deleteRight',
              }]
          },
          performerType: [{
              text: 'allUsersTask',
              value: 'humanPerformer'
          }, {
              text: 'shareTask',
              value: 'humanPotentialOwner'
          }],
          nodeEventOptions: [{
              "text": "Activated",
              "value": "Activated"
          }, {
              "text": "Approved",
              "value": "Approved"
          }, {
              "text": "Rejected",
              "value": "Rejected"
          }],
          processEventOptions: [{
              "text": "Approved",
              "value": "Approved"
          }, {
              "text": "Rejected",
              "value": "Rejected"
          }, {
              "text": "Terminated",
              "value": "Terminated"
          }, {
              "text": "Canceled",
              "value": "Canceled"
          }, {
              "text": "Suspended",
              "value": "Suspended"
          }, {
              "text": "Resumed",
              "value": "Resumed"
          }],
          //formType:
          scriptFormatType: [{
              value: 'SQL',
              text: 'SQL'
          }, {
              value: 'CSharp',
              text: 'C#'
          }],
          notificationTemplate: [],

          templateVariable: [{
              text: 'name of applicant',
              value: 'sys_pi_applicant_employee_displayname',
              description: '申请人的显示名（多语言）。'
          }, {
              text: 'job number of applicant',
              value: 'sys_pi_applicant_employee_jobno',
              description: '申请人的工号。'
          }, {
              text: 'Email of applicant',
              value: 'sys_pi_applicant_employee_email',
              description: '申请人的Email。'
          }, {
              text: 'phoneNumber of applicant',
              value: 'sys_pi_applicant_employee_cellphone',
              description: '申请人的手机号码。'
          },

            {
                text: 'name of task',
                value: 'sys_task_name',
                description: '当前任务的名称。'
            }, {
                text: 'theme of task',
                value: 'sys_task_subject',
                description: '当前任务的主题。'
            }, {
                text: 'description of task',
                value: 'sys_task_description',
                description: '当前任务的描述。'
            }, {
                text: 'time of  arrivaling task',
                value: 'sys_task_arrivetime',
                description: '当前任务的到达时间。'
            }, {
                text: 'time of end task',
                value: 'sys_token_completetime',
                description: '当前任务的所属令牌的完成时间。'
            }, {
                text: 'priority of task',
                value: 'sys_task_priority_displayname',
                description: '当前任务的优先级显示文字（多语言）。'
            },

            {
                text: 'primary depart of applicant',
                value: 'sys_pi_applicant_department_name',
                description: '申请人的首要部门的部门名称。'
            },

            {
                text: 'process example',
                value: 'sys_p_displayname',
                description: '流程实例的显示名称（多语言）。'
            }, {
                text: 'examination result of process',
                value: 'sys_pi_result_displayname',
                description: '流程实例的审批结果的文字显示（多语言）。'
            }
          ],

          recipients: [{
              value: '',
              text: 'please choose'
          }, {
              text: 'submitter',
              value: 'sys_pi_applicant_account_id'
          }, {
              text: 'all handlers of current task',
              value: 'sys_recipients'
          }, {
              text: 'unfinished handlers of current task',
              value: 'sys_recipients_todo'
          }, {
              text: 'finished handlers of current task',
              value: 'sys_recipients_done'
          }, {
              text: 'all participators of currrent task',
              value: 'sys_participants'
          }, {
              text: 'all interrelated users',
              value: 'sys_users'
          }]
      };
})();
