// vite.config.ts
import react from "file:///mnt/c/Users/RobotComp.ru/Documents/projects/offer/offer_frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///mnt/c/Users/RobotComp.ru/Documents/projects/offer/offer_frontend/node_modules/vite/dist/node/index.js";
import svgr from "file:///mnt/c/Users/RobotComp.ru/Documents/projects/offer/offer_frontend/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    extensions: [".css"],
    esbuildOptions: {
      plugins: [
        (await import("file:///mnt/c/Users/RobotComp.ru/Documents/projects/offer/offer_frontend/node_modules/esbuild-sass-plugin/lib/index.js")).sassPlugin({
          type: "style"
        })
      ]
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvUm9ib3RDb21wLnJ1L0RvY3VtZW50cy9wcm9qZWN0cy9vZmZlci9vZmZlcl9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL1JvYm90Q29tcC5ydS9Eb2N1bWVudHMvcHJvamVjdHMvb2ZmZXIvb2ZmZXJfZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL1JvYm90Q29tcC5ydS9Eb2N1bWVudHMvcHJvamVjdHMvb2ZmZXIvb2ZmZXJfZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBzdmdyKCldLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICBleHRlbnNpb25zOiBbJy5jc3MnXSxcbiAgICAgICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICAoYXdhaXQgaW1wb3J0KCdlc2J1aWxkLXNhc3MtcGx1Z2luJykpLnNhc3NQbHVnaW4oe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3R5bGUnLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFYLE9BQU8sV0FBVztBQUN2WSxTQUFRLG9CQUFtQjtBQUMzQixPQUFPLFVBQVU7QUFHakIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFBQSxFQUN6QixjQUFjO0FBQUEsSUFDVixZQUFZLENBQUMsTUFBTTtBQUFBLElBQ25CLGdCQUFnQjtBQUFBLE1BQ1osU0FBUztBQUFBLFNBQ0osTUFBTSxPQUFPLHdIQUFxQixHQUFHLFdBQVc7QUFBQSxVQUM3QyxNQUFNO0FBQUEsUUFDVixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxZQUFZO0FBQUEsSUFDaEI7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
