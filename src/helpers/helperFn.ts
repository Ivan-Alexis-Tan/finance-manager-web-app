export function dateFormatter(dateStr: string) {
    const date = new Date(`${dateStr}`)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}/${`${month}`.padStart(2, "0")}/${`${day}`.padStart(2, "0")}`
}

export function capsEveryWord(str: string, sep: string = " ", inBetween: string = " ") {
    const capWords = str.split(sep).map(s => s.charAt(0).toUpperCase() + s.slice(1))
    return capWords.join(inBetween)
}