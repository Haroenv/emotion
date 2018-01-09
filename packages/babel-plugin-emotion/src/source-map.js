// @flow
import { SourceMapGenerator } from 'source-map'
import convert from 'convert-source-map'
import type { EmotionBabelPluginPass } from './index'
import type { BabelFile } from 'babel-flow-types'

function getGeneratorOpts(file) {
  return file.opts.generatorOpts ? file.opts.generatorOpts : file.opts
}

export function makeSourceMapGenerator(file: BabelFile) {
  const generatorOpts = getGeneratorOpts(file)
  const filename = generatorOpts.sourceFileName
  const generator = new SourceMapGenerator({
    file: filename,
    sourceRoot: generatorOpts.sourceRoot,
  })

  generator.setSourceContent(filename, file.code)
  return generator
}

export function addSourceMaps(
  offset: { line: number, column: number },
  state: EmotionBabelPluginPass
) {
  const generator = makeSourceMapGenerator(state.file)
  const generatorOpts = getGeneratorOpts(state.file)
  generator.addMapping({
    generated: {
      line: 1,
      column: 0,
    },
    source: generatorOpts.sourceFileName,
    original: offset,
  })
  return '\n' + convert.fromObject(generator).toComment({ multiline: true })
}
