module.exports = function(readme, beginDate) {
    let title = readme.match(/^#(.*)(\n|\r)/)
    title = title && title[1].trim()

    let editDate = readme.match(/修改日期[:：]([\d- ]*)(\n|\r)/)
    editDate = editDate && new Date(editDate[1].trim())

    let progress = readme.match(/进度[:：](\d*)\% *(\n|\r)/)
    progress = progress && parseInt(progress[1]) / 100

    let teamers = readme.match(/参与人员[:：](.*) *(\n|\r)/)
    teamers = teamers && teamers[1]

    let splitor = /\,/.test(teamers) ? ',' : ' '
    teamers = teamers && teamers.trim().split(splitor)

    let logText = readme.match(/修改记录([^#$]*)/)
    logText = logText && logText[1]

    let logs = []
    if (logText) {
        // 分拆修改记录
        let logTexts = logText.match(/- [\d-\/ ]*(\n|\r)([\S\s](?!- \d))*/g)
        for (let l in logTexts) {
            let date = logTexts[l].match(/- ([\d-\/ ]*)/)
            date = date && new Date(date[1])
            if (date >= beginDate) {
                // 只保留大于beginDate的修改记录
                logs.push(logTexts[l])
            }
        }
    }
    return title ? { title, editDate, progress, teamers, logs } : {}
}
