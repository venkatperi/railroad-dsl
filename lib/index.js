const { AstBuilder } = require('ast-builder')
const RR = require('railroad-diagrams')

let items = {
  'diagram': (n, c) => new RR.Diagram(c),
  'sequence': (n, c) => new RR.Sequence(c),
  'stack': (n, c) => new RR.Stack(c),
  'optionalSequence': (n, c) => new RR.OptionalSequence(c),
  'choice': (n, c) => new RR.Choice(n.value, c),
  'all': (n, c) => new RR.MultipleChoice(n.value, 'all', c),
  'any': (n, c) => new RR.MultipleChoice(n.value, 'any', c),
  'horizontalChoice': (n, c) => new RR.HorizontalChoice(c),
  'optional': (n, c) => new RR.Optional(c[0], n.attributes.skip ? 'skip' : undefined),
  'oneOrMore': (n, c) => new RR.OneOrMore(c[0], n.attributes.repeat),
  'zeroOrMore': (n, c) => new RR.ZeroOrMore(c[0], n.attributes.repeat, n.attributes.skip ? 'skip' : undefined),

  'terminal': (n, c) => new RR.Terminal(n.value, n.attributes.href),
  'nonTerminal': (n, c) => new RR.NonTerminal(n.value, n.attributes.href),
  'comment': (n, c) => new RR.Comment(n.value, n.attributes.href),
  'skip': (n, c) => new RR.Skip(),
  'start': (n, c) => new RR.Start(n.value),
  'end': (n, c) => new RR.End(),
}

class RRBuilder extends AstBuilder {
  constructor() {
    super(Object.keys(items))
  }
}

function nop() { }

function ast2railroad(ast) {
  return ast.postOrder((n, c) => (items[n.name] || nop)(n, c))
}

function rrBuilder(config) {
  let ast = new RRBuilder().build(config)
  return ast2railroad(ast)
}

module.exports = rrBuilder

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
