const date = new Date()
const begin = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1)
const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - date.getDay())

module.exports = {
    begin: `${begin.getFullYear()}-${begin.getMonth() + 1}-${begin.getDate()}`,
    end: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
    beginDate: begin,
    endDate: end
}
