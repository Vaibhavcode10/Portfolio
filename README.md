# Vaibhav - creative frontend portfolio

An electric violet, hot pink, and acid lime portfolio built with React and three interactive, lazy-loaded Three.js models.

## Run locally

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policies block `npm`.

```sh
npm run build
npm run preview
npm run lint
```

## Current implementation

- `src/studio/Portfolio.jsx`: navigation, hero, OS_UI concept preview, expertise, About, education, contact, and footer.
- `src/studio/Sculpture.jsx`: original procedural WebGL sculpture. No downloaded model or image texture required.
- `src/studio/studio.css`: responsive layout and motion foundations.
- `src/studio/electric.css`: rich color palette, chromatic typography, aurora lighting, and model gallery.
- `src/studio/models.js`: procedural tower, orbital engine, and crystalline bloom geometry.
- `src/Component/Reveal.jsx`: progressive scroll reveals with keyboard and reduced-motion support.
- `src/Component/usePointerDepth.js`: frame-scheduled pointer interaction.

The older sections are retained in `src/Sections` but are not mounted by the new application. The pre-redesign archive is in `.checkpoints`.

## Interactive 3D playground

The hero introduces Vaibhav with a prominent portrait. The playground contains the multicolor helical tower, kinetic orbital engine, and crystalline bloom, each with expand/reform buttons and keyboard-accessible rotation sliders. New model canvases initialize near the viewport. All three share a lazy-loaded renderer module, honor the motion pause control, and skip offscreen rendering. Static renders invalidate on resize so paused canvases stay visible.

## Interaction inventory

1. Procedural 34-layer 3D sculpture.
2. Continuous helical deformation.
3. Pointer-controlled sculpture orientation.
4. Interactive exploded/reassembled sculpture.
5. Physically lit metallic surfaces with mint/violet lighting.
6. Slow spatial particle field.
7. Floating sculpture motion.
8. Perspective grid behind the sculpture.
9. Tilted, dimensional OS_UI concept preview.
10. Elevated desktop dock and layered shadows.
11. Interactive preview tabs and animated equalizer.
12. Pointer-responsive expertise cards.
13. Layered floating planes for interface engineering.
14. Rotating prism planes for interaction design.
15. Dimensional stacked cube planes for tooling.
16. Cursor-positioned card illumination.
17. Portrait depth and grayscale-to-color hover.
18. Offset portrait caption on a separate depth plane.
19. Progressive section reveals.
20. Diagonal moving typography ribbon.
21. Rotating typographic accents.
22. Button sweep and arrow movement.
23. Reading progress indicator.
24. Footer wordmark and arrow response.

## Performance and accessibility

The Three.js chunk loads separately. Rendering is capped at about 30 fps with pixel ratio capped at 1.5, skips hidden/offscreen frames, and renders a static pose for reduced motion or the pause control. WebGL failure shows a typographic fallback. Resources, observers, and listeners are cleaned up on unmount. CSS animations honor reduced motion and the page-wide pause control.

Google Fonts supplies DM Sans and Space Grotesk; local system fonts remain as fallbacks. The portrait is a local PNG. Layout checks cover 320, 390, 768, 1024, and 1440 px. Contact uses `mailto:vaibhavhoke.dev@gmail.com`; it opens the visitor's mail client rather than sending from a backend.

The OS_UI panel is labeled as a concept preview. The portfolio does not invent live project links, certificate issuers, or testimonials.

## Visual research

- https://bruno-simon.com/ ? spatial interaction reference.
- https://threejs.org/examples/ ? real-time geometry and particle techniques.
- https://www.haloxion.com/ ? initial reference supplied by the owner.

The layout, sculpture, typography composition, and preview are original implementations for this portfolio.
