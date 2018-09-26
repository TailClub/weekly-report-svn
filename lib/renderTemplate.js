const reportTemplate = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <div class="container">
        <h3>前端周报{{reportDate}}</h3>
        <hr>
        <div>
            {{reportDetail}}
        </div>
        <small>备注:带'页面'的项目为静态页面项目,其余为'前后端分离'的前端开发项目。</small>
    </div>
</body>

</html>
`

const detailTemplate = `
<b>【{{title}}】</b>
<small>参与人员: {{teamers}}</small>
<pre>{{logs}}</pre>
<br>
<br>
`

module.exports = function(data, end) {
    const detail = []
    data.forEach(item => {
        if (!item.title) return
        detail.push(
            detailTemplate
                .replace('{{title}}', item.title)
                .replace('{{teamers}}', item.teamers.join(' '))
                .replace('{{logs}}', item.logs)
        )
    })
    return reportTemplate.replace('{{reportDate}}', end).replace('{{reportDetail}}', detail.join(''))
}
