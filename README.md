# TextToggle

A jQuery-based text carousel/slider that displays multiple texts in a single position. Only one text is shown at a time, and users can navigate through texts using arrows or navigation dots.

## Features

- Display multiple text items with titles in a carousel format
- Navigate through items using left/right arrows
- Quick navigation using dots at the bottom
- Smooth transition animations
- Configurable width
- Circular navigation (loops back to start/end)

## Installation

1. Include jQuery in your project
2. Add the TextToggle.js file to your project
3. Include required CSS styles (see Usage section for required classes)

## Usage

### Basic Setup
```javascript 
$(document).ready(function () { new TextToggleHandler({width: 500}); });
```

### Configuration

The TextToggleHandler accepts a configuration object with the following options:

- `width`: Width of the text container in pixels (default: 500)

## Components

### TextToggleHandler

Main handler class that manages all text toggle instances on the page.

### TextToggle

Represents a single text toggle instance with navigation controls.

### TextToggleItem

Represents an individual text item with title and content.
