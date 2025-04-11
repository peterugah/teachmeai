import { AskMore } from "./AskMore";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Pronunciation } from "./Pronunciation";

export function Index() {
	return (
		<div className={`max-w-sm mx-auto bg-white rounded-2xl shadow-lg `}>
			<Header />
			<div className="p-4">
				<Pronunciation
					title="Pronunciation"
					content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, fugit
				repudiandae vel aliquid amet saepe cum? Sapiente at, accusantium minus
				adipisci eaque nemo explicabo voluptatem tempore eligendi nobis dolorum
				harum."
				/>
				<Content
					title="Explanation"
					content="# My Markdown Example

## Introduction

This is a sample markdown file that demonstrates the basic syntax and features of markdown. Markdown is a lightweight markup language with plain-text formatting syntax.

## Table of Contents

1. [Introduction](#introduction)
2. [Headers](#headers)
3. [Lists](#lists)
4. [Links](#links)
5. [Images](#images)
6. [Code Blocks](#code-blocks)
7. [Blockquotes](#blockquotes)

## Headers

Markdown allows you to create headers by adding hash symbols (`#`) at the beginning of a line. The number of hashes corresponds to the header level.

### Header 3

#### Header 4

##### Header 5

## Lists

You can create ordered and unordered lists in markdown.

- Unordered List Item 1
- Unordered List Item 2
  - Nested Unordered List Item
  - Nested Unordered List Item 2
- Unordered List Item 3

1. Ordered List Item 1
2. Ordered List Item 2
3. Ordered List Item 3

## Links

You can create links using the following syntax:

[Google](https://www.google.com)

## Images

You can embed images using this syntax:

![Image Alt Text](https://via.placeholder.com/150)

## Code Blocks

For inline code, use backticks:

`inline code`

For multi-line code blocks, use triple backticks:

"
				/>
				<AskMore />
			</div>
			<Footer />
		</div>
	);
}
