import { Locale, MessageTree } from 'next-flow-interface'
import en from './en'
import zh from './zh'

const allMessages: Record<string, MessageTree> = {
  [Locale.EN]: en,
  [Locale.ZH]: zh,
}

export default allMessages[window.locale]
