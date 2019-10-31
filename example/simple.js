const rrBuilder = require('..')

let diag = rrBuilder(() =>
  diagram(() => {
    optional({ skip: true }, () => terminal('+'))
    choice(0, () => {
      nonTerminal('name-start char')
      nonTerminal('escape')
    })
    zeroOrMore(() =>
      choice(0, () => {
        nonTerminal('name char')
        nonTerminal('escape')
      })
    )
  }))

console.log(diag.toString())
