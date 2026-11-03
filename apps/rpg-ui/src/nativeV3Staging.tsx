import React from 'react';
import { createRoot } from 'react-dom/client';
import { EpochApp } from './EpochApp.js';
import './index.css';
import './styles/main-menu-refinement.css';

declare const __LINEAGE_NATIVE_STAGING_ORIGIN__: string;

const root = createRoot(document.getElementById('root')!);
if (window.location.origin !== __LINEAGE_NATIVE_STAGING_ORIGIN__) {
  root.render(<main role="alert">This native-v3 staging build is not configured for this origin.</main>);
} else {
  // This entry has no QA seeding or query flag. Host access control remains mandatory.
  root.render(<EpochApp stagingNativeV3 />);
}
