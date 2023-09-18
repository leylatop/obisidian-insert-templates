import moment from 'moment';

import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, setIcon, Setting } from 'obsidian';

// import {
// 	isModifier,
// 	KeyChord,
// 	keySequenceEqual,
// 	codeToString,
// 	keySequencePartiallyEqual,
// } from "keys";

// import { HotkeyManager } from "hotkey-manager";
// import { ChordListener } from "./src/chord_listener";
import { InsertTemplateSetting, INSERT_TEMPLATES_SETTINGS } from './constants';

interface InsertTemplateSettings {
  insertTemplateSettings: InsertTemplateSetting[]
}

export default class MyPlugin extends Plugin {
	settings: InsertTemplateSettings;
	async onload() {
		await this.loadSettings();

    // 在obsidian的左侧菜单栏添加一个图标，dice是图标的名字，Insert Templates Freely是鼠标悬浮在图标上时的提示;
    // dice 可以换成其他的图标，具体可以参考 https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free
		const ribbonIconEl = this.addRibbonIcon('keyboard', 'Insert Templates Freely', (evt: MouseEvent) => {
      // 点击左侧侧边栏时，在右上角弹出一个提示
			new Notice('Hello, World!');
		});
  
    // 为左侧菜单栏的图标添加一个class
		ribbonIconEl.addClass('my-plugin-ribbon-class');

    // 在左侧菜单栏的图标上添加一个右键菜单，右键菜单展示在整个界面的右下角
    // 右键菜单可以用来添加一些命令，比如打开一个弹窗
		const statusBarItemEl = this.addStatusBarItem();
    // 在右键菜单中添加一个选项
		statusBarItemEl.setText('Inert Templates Freely');
    statusBarItemEl.addClass('my-plugin-status-bar-class');
    // 在右键菜单中添加一个选项，点击选项时，弹出一个提示
    statusBarItemEl.onClickEvent((evt: MouseEvent) => {
      new Notice('Yet!');
    });

    // 命令面板的快捷键是ctrl+p
    // 添加一个命令，命令的id是open-sample-modal-simple，命令的名字是Open sample modal (simple)，命令的回调函数是打开一个弹窗
    // 在命令面板中输入open-sample-modal-simple，就可以打开一个弹窗
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

    // 添加一个命令，命令的id是sample-editor-command，命令的名字是Sample editor command，命令的回调函数是在编辑器中插入一段文字
    // 在命令面板中输入sample-editor-command，就可以在编辑器中插入一段文字
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
      // editor 是obsidian中的一个类，可以获取当前的editor
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample Editor Command');
			}
		});

    // 添加一个命令，命令的id是open-sample-modal-complex，命令的名字是Open sample modal (complex)，命令的回调函数是打开一个弹窗
    // 在命令面板中输入open-sample-modal-complex，就可以打开一个弹窗
    this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
        // 检查当前是否有markdownView，如果有，就打开一个弹窗
        // markdownView 是obsidian中的一个类，可以获取当前的markdownView
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						new SampleModal(this.app).open();
					}

					return true;
				}
			}
		});
    // 添加一个设置tab，在obsidian的设置中，可以看到这个tab
		this.addSettingTab(new SampleSettingTab(this.app, this));

    // 注册一个事件，当点击文档时，触发事件
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			// console.log('click', evt);
		});

    // 注册一个键盘事件，当按下键盘时，触发事件
    this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
      // 当按下control + i时，将`hello world` 插入到编辑器中
      if (evt.ctrlKey && evt.key === 'i') {
        const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;

        // 将 editor 的鼠标焦点移动到整个文档的最前面
        editor?.setCursor(0, 0);
        // 1. 获取 Templates/daily-template-simple.md 文件内容
        // 2. 将 Templates/daily-template-simple.md 文件内容格式化
        // 3. 将鼠标焦点移动到文档的最前面
        // 4. 将格式化后的内容，以obsidian的模板的形式插入到编辑器中
        // 5. 手动换行

        const file = this.app.vault.getAbstractFileByPath('Templates/daily-template-simple.md');
        this.app.vault.read(file).then((content) => {
          content = content
            // 设置日期
            .replace(/{{date}}/g, moment().format('YYYY-MM-DD'))
            // 设置时间
            .replace(/{{time}}/g, moment().format('h:mm:ss'))
            // 设置年的中文
            .replace(/{{date:YYYY}}/g, moment().format('YYYY'))

            // 设置月的中文
            .replace(/{{date:MM}}/g, moment().format('MM'))
            
            // 设置日期的中文
            .replace(/{{date:DD}}/g, moment().format('DD'))

            // 设置星期几的中文
            .replace(/{{date:dddd}}/g, moment().format('dddd')
            .replace('Monday', '星期一')
            .replace('Tuesday', '星期二')
            .replace('Wednesday', '星期三')
            .replace('Thursday', '星期四')
            .replace('Friday', '星期五')
            .replace('Saturday', '星期六')
            .replace('Sunday', '星期日'))
          editor?.setCursor(0, 0);
          editor?.replaceSelection(content);
          editor?.replaceSelection('\n\n');
        })
      }
    });

    // 注册一个Interval，每隔5分钟，打印一次'setInterval'
		this.registerInterval(window.setInterval(() => {
      // console.log('setInterval')
    }, 5 * 60 * 1000));
	}

	onunload() {
	}

	async loadSettings() {
    // 从本地存储中加载数据，如果没有数据，就使用默认的数据
    // 本地存储的数据存储在obsidian的vault中，可以通过this.app.vault获取
    // 设置本地存储的数据通过this.saveData(data)来保存
    this.settings = Object.assign({}, await this.loadData());
    if (!this.settings.insertTemplateSettings) {
      this.settings.insertTemplateSettings = INSERT_TEMPLATES_SETTINGS
    }
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// SampleModal 类继承自Modal，Modal是obsidian中的一个类，可以在弹窗中显示一些内容
class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	// 弹窗打开时，弹窗中的内容
  onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

  // 弹窗关闭时，清除弹窗中的内容
	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// SampleSettingTab 是一个设置，继承自PluginSettingTab，PluginSettingTab是obsidian中的一个类，可以在设置中显示一些内容
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
    // containerEl 是一个div，可以在div中添加一些内容
    // containerEl会显示在obsidian的设置中
		containerEl.empty();

		containerEl.createEl('h2', {text: 'Insert Templates Freely Plugin'});

    (this.plugin.settings.insertTemplateSettings).forEach((setting) => {
      new Setting(containerEl)
        .setName(setting.settingName)
        .setDesc(setting.settDescription)
        .addToggle((toggle) => {
          toggle.setValue(setting.settingIsEnable).onChange(async (value) => {
            setting.settingIsEnable = value;
            await this.plugin.saveSettings();
          })
        })
    })

    // 添加一个按钮，点击按钮时，弹出一个弹窗
    new Setting(containerEl)
      .setName('Open sample modal')
      .setDesc('Click to open')
      .addButton(button => button
        .setButtonText('Open')
        .onClick(() => {
          new AddSettingModal(this.app).open();
        }
      ));
	}
}

class AddSettingModal extends Modal {
  constructor(app: App) {
		super(app);
	}
  
  handleAddShortcutKeyBtnClick = () => {
    
  }

	// 弹窗打开时，弹窗中的内容
  onOpen() {
		const {contentEl} = this;
    // 在弹窗内添加一个标题，标题的内容是Add Setting
    contentEl.createEl('h2', {text: 'Add Setting'});
    // 输入框的placeholder是Setting Name
    contentEl.createEl('div', { cls: "setting-name-container" }, (el) => {
      el.createEl("span", { text: "Setting Name: ", cls: "setting-label"});
      el.createEl("input", { placeholder: "Setting Name" }).addClass("setting-input");
    })

    contentEl.createEl('div', { cls: "setting-description-container" }, (el) => {
      el.createEl("span", { text: "Setting description: " }).addClass("setting-label");
      el.createEl("input", { placeholder: "Setting Description" }).addClass("setting-input");
    })

    contentEl.createEl('div', { cls: "setting-shortcut-container" }, (el) => {
      el.createEl("span", { text: "Setting shortcut key: " }).addClass("setting-label");
      el.createEl("span", {
        cls: "setting-add-hotkey-button",
        attr: { "aria-label": "Customize this command" }
      }, (el) => {
        setIcon(el, "any-key");
      })
    })
	}

  // 弹窗关闭时，清除弹窗中的内容
	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
