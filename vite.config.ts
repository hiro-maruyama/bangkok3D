import { defineConfig } from "vite"
export default defineConfig({
    build: { 
       chunkSizeWarningLimit: 100000000
    },
    base: "/bangkok3D/" 
});
//export default defineConfig({ base: "/bangkok3D/" });
