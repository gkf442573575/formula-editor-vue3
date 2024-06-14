import {
  Decoration,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  EditorView,
  type DecorationSet
} from '@codemirror/view'

class PlaceholderWidget extends WidgetType {
  readonly name: string
  readonly category: string
  constructor(name: string, category: string) {
    super()
    this.name = name
    this.category = category
  }
  eq(other: PlaceholderWidget) {
    return this.name == other.name && this.category == other.category
  }
  toDOM() {
    const widget = document.createElement('span')
    widget.className = `cm-widget-placeholder cm-widget-placeholder__${this.category}`
    widget.textContent = this.name
    return widget
  }
  ignoreEvent() {
    return false
  }
}

/**
 * @desc 创建自动匹配进行占位
 * @param regexp 进行字段匹配
 * @param matchHandler 对匹配进行处理
 * @param category // 其他的classname
 * @returns
 */
export const createMathPlaceholder = (
  regexp: RegExp,
  matchHandler: (match: RegExpExecArray) => string,
  category?: string
) => {
  const placeholderMatcher = new MatchDecorator({
    regexp, //支持中文
    decoration: match => {
      const name: string = matchHandler(match)
      return Decoration.replace({
        widget: new PlaceholderWidget(name, category || 'widget')
      })
    }
  })

  const placeholders = ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view)
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
      }
    },
    {
      decorations: instance => instance.placeholders,
      provide: plugin =>
        EditorView.atomicRanges.of(view => {
          return view.plugin(plugin)?.placeholders || Decoration.none
        })
    }
  )

  return placeholders
}
