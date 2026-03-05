# Makefile for Fill-4-Me Extension Packaging

# Variables
NAME = fill-4-me
VERSION = $(shell node -p "require('./package.json').version")
DIST_DIR = dist
PACKAGE_NAME = $(NAME)-v$(VERSION).zip

.PHONY: all clean build package help

all: package

# Clean build artifacts
clean:
	@echo "Cleaning up..."
	rm -rf $(DIST_DIR)
	rm -f *.zip

# Build the project
build: clean
	@echo "Building the project..."
	npm run build

# Package the extension for Chrome Web Store
package: build
	@echo "Packaging extension v$(VERSION)..."
	@if [ -d "$(DIST_DIR)" ]; then \
		cd $(DIST_DIR) && zip -r ../$(PACKAGE_NAME) *; \
		echo "Successfully created $(PACKAGE_NAME)"; \
	else \
		echo "Error: $(DIST_DIR) directory not found. Build failed?"; \
		exit 1; \
	fi

# Help command
help:
	@echo "Available commands:"
	@echo "  make build    - Build the project (npm run build)"
	@echo "  make package  - Build and package the extension into a .zip file"
	@echo "  make clean    - Remove build artifacts and zip files"
	@echo "  make help     - Show this help message"
