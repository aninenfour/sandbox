import React from 'react';

/**
 * THE LOOK
 *
 * One switch that changes the whole surface of an episode.
 *
 *   flat      the original archival paper, type set directly on the page
 *   cutPaper  the same paper, but every beat sits on a torn card with a shadow
 *   white     Editorial White: pure white, hairlines, one heavy grotesk
 *   terminal  Beyond the Green: black, looping code rain, pages swap through
 *             a slit of light at the centre of the frame
 *
 * Episodes opt in per file, so changing this never disturbs anything already
 * rendered.
 */
export type Look = 'flat' | 'cutPaper' | 'white' | 'terminal';

const LookContext = React.createContext<Look>('flat');

export const LookProvider: React.FC<{ value: Look; children: React.ReactNode }> = ({
  value,
  children,
}) => React.createElement(LookContext.Provider, { value }, children);

export const useLook = () => React.useContext(LookContext);
