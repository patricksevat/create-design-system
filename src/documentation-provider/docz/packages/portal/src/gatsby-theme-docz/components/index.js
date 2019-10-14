import StencilJSProps from './StencilJSProps'

import * as headings from 'gatsby-theme-docz/src/components/Headings'

import { Code } from 'gatsby-theme-docz/src/components/Code'
import { Layout } from 'gatsby-theme-docz/src/components/Layout'
import { Playground } from 'gatsby-theme-docz/src/components/Playground'
import { Pre } from 'gatsby-theme-docz/src/components/Pre'
import { Props } from 'gatsby-theme-docz/src/components/Props'

export default {
  ...headings,
  code: Code,
  playground: Playground,
  pre: Pre,
  layout: Layout,
  props: Props,
  'StencilProps': StencilJSProps,
}
