const fs = require('fs')
const child = require('child_process')
const config = require('../config')
const formatSection = require('./formatSection')
const renderTemplate = require('./renderTemplate')
const { begin, end, beginDate } = require('./formatDate')

module.exports = function() {
    const mdPaths = []
    const mdMaps = new Map()
    child
        .execSync(`svn log ${config.svnDir} -v -r{${begin}}:{${end}} | grep "README.md" | grep -E "M | A "`)
        .toString()
        .split('\n')
        .map(v => {
            return v.trim().replace(/[MA]\s+/g, '')
        })
        .filter(v => {
            return v.length
        })
        .forEach(v => {
            mdMaps.set(v, 1)
        })
    for (const [key] of mdMaps) {
        mdPaths.push(key)
    }
    const execActions = []
    mdPaths.forEach(v => {
        execActions.push(
            new Promise((resolve, reject) => {
                child.exec(`svn cat ${config.svn + v}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(formatSection(stdout, beginDate))
                    }
                })
            })
        )
    })

    if (!fs.existsSync(config.reportDir)) {
        fs.mkdirSync(config.reportDir)
    }

    Promise.all(execActions).then(res => {
        const fileName = `${config.reportDir + end}.html`
        fs.writeFile(fileName, renderTemplate(res, end), err => {
            if (err) {
                console.log('生成周报失败')
            } else {
                console.log(`生成周报${end}成功`)
                child.exec(`open ${fileName}`)
            }
        })
    })
}
