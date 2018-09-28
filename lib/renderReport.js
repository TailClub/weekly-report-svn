const fs = require('fs')
const child = require('child_process')
const config = require('../config')
const formatSection = require('./formatSection')
const renderTemplate = require('./renderTemplate')
const { begin, end, beginDate } = require('./formatDate')

module.exports = function() {
    // 存储有效的readme文件路径
    const mdPaths = []
    // 用于readme路径去重
    const mdSet = new Set()

    child
        .execSync(`svn log ${config.svnDir} -v -r{${begin}}:{${end}} | grep "README.md" | grep -E "M | A "`)
        .toString()
        .split('\n')
        .map(v => {
            // 删除路径外的字符
            return v.trim().replace(/[MA]\s+/g, '')
        })
        .filter(v => {
            // 过滤空内容
            return v.length
        })
        .forEach(v => {
            // 执行去重操作
            // mdSet.set(v, 1)
            mdSet.add(v)
        })

    mdSet.forEach(v => {
        mdPaths.push(v)
    })

    // 遍历获取readme文件的头150行内容（ 目测应该足够了 ）
    const execActions = []
    mdPaths.forEach(v => {
        execActions.push(
            new Promise((resolve, reject) => {
                child.exec(`svn cat ${config.svn + v} | head -150`, (error, stdout, stderr) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(formatSection(stdout, beginDate))
                    }
                })
            })
        )
    })

    // 是否存在存放report的文件夹
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
