export interface InsertTemplateSetting {
  settingId: string
  settingName: string
  settDescription: string
  settingKeyShortcuts: string
  settingIsEnable: boolean
}

export const INSERT_TEMPLATES_SETTINGS: InsertTemplateSetting[]
 = [
  {
    settingId: 'Insert Templates Daily Simple',
    settingName: 'Insert Templates Daily Simple',
    settDescription: 'Use Ctrl + 1 to insert daily template',
    settingKeyShortcuts: 'Ctrl + 1',
    settingIsEnable: true
  }
]