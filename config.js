var lauch_mode = "Development"; //Production or Development

module.exports = {
    lauch_mode: lauch_mode,
    makers: [
        {
          name: '@electron-forge/maker-squirrel',
          config: {
            authors: 'Le Thanh Phuc',
            description: 'Tool - Ứng đọc file ngôn ngữ Flutter'
          },
        },
      ]
}