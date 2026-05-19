/**
 * The canonical palette. Mirror of src/styles/STYLE.md §1.
 * No component file may hardcode a color — import from here.
 * When STYLE.md changes, change this file in the same commit.
 */

export const palette = {
  ground: {
    grass: '#9bbf6b',
    grassDark: '#7da352',
    dirt: '#c2a878',
    sand: '#d8c89a',
  },
  road: {
    asphalt: '#3f4046',
    asphaltDark: '#2f3035',
    lane: '#e8e6dc',
  },
  sidewalk: '#bcb6a3',
  water: '#7fb0c4',
  civic: {
    wall: '#efe7d6',
    wallAlt: '#dcd2bd',
    trim: '#8d8579',
    glass: '#3f6f86',
    glassLit: '#5a8ea3',
    roof: '#cdc4b0',
  },
  res: {
    wallCream: '#f1e6cf',
    wallWarm: '#e8d2a9',
    wallCool: '#dadbcf',
    roofTile: '#c0683d',
    roofTileDark: '#9a4f2c',
    trim: '#6e4632',
    chimney: '#a86348',
  },
  mur: {
    yellow: '#d9b34a',
    cream: '#e9d49a',
    sage: '#9bab7e',
    brick: '#a8553e',
    teal: '#5e8a87',
    awningRed: '#b85040',
    awningYellow: '#d99c3a',
    awningGreen: '#5d7a48',
    awningStripe: '#e8e6dc',
  },
  tree: {
    broadDark: '#3e6b3a',
    broadMid: '#5a8a48',
    broadLite: '#86a85c',
    palmFrond: '#6b9646',
    palmTrunk: '#cdb98a',
    broadTrunk: '#5c4326',
  },
  car: {
    red: '#bf4634',
    yellow: '#d9b53d',
    blue: '#3a6a93',
    white: '#e8e3d4',
    gray: '#7d7e82',
    black: '#2c2e33',
  },
  sky: {
    day: '#cfe4b3',
    fog: '#d8e6c2',
  },
} as const

export const FLOOR_HEIGHT = 3.2
export const LANE_WIDTH = 2.5
export const SIDEWALK_WIDTH = 1.5
export const ROAD_SHOULDER = 0.5

export type CarColorToken = keyof typeof palette.car
export type ColorFamily = 'civic' | 'residential' | 'commercial'
export type TreeVariant = 'palm' | 'broadleaf' | 'oak'
export type RoofStyle = 'flat' | 'gable' | 'hip'
