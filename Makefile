# Fill-4-Me Production Makefile

.PHONY: all build zip clean icons

# Default target
all: build zip

# Build the production assets
build:
	@echo "Building production assets..."
	npm run build

# Package the extension for upload
zip: build
	@echo "Creating production zip..."
	@mkdir -p releases
	@cd dist && zip -r ../releases/fill-4-me-v$$(node -p "require('./package.json').version").zip .
	@echo "Package created in releases/ folder."

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist
	rm -rf releases

# Helper to remind about icons
icons:
	@echo "Icons are located in public/ folder."
	@echo "Ensure you have icon16.png, icon48.png, and icon128.png ready."
