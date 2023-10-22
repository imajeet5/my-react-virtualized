# Exploring Infinite Scroll and React Virtualization

In the age of social media, infinite scroll has become a ubiquitous feature. Whether it's Twitter, Instagram, Facebook, or YouTube, we're all familiar with the seamless experience of loading content as we scroll. Have you ever wondered how it works under the hood? In this post, I'll take you on a journey through my experience of custom implementing infinite scroll in a React application.

## The Initial Simplicity

At first glance, it seems quite simple. Set up an observer at the bottom of the last post, and when the user reaches that point, trigger an API call to load more content. The observer then shifts to watch the next post. But as I delved deeper into the task, I realized that things could get complex.

## 1. Handling the Data Deluge

Consider an application with a vast number of posts, complete with images and videos. Loading all this data into the DOM one after the other can slow down your application. Even worse, you might have numerous DOM nodes that are out of sight but still eating up memory. This is where virtualization comes to the rescue. It only renders nodes for the current viewport, removing those that are out of sight and adding new ones as the user scrolls.

## 2. Keeping the Scroll Continuous

Users hate waiting for the next set of posts to load. To ensure a seamless experience, we keep track of the number of posts loaded from the API. Every time a user scrolls, we check if the sum of the endRow index and a margin value is greater than the count of posts already loaded. If it is, we load the new posts.

## 3. Resuming the Journey

What if you want to allow users to pick up their journey from where they left off? We can store the user's scroll position in localStorage. When the user returns, we calculate the startIndex and endIndex of the posts in the viewport. Based on the endIndex, we load that number of posts the first time.

## 4. The Challenge of Dynamic Heights

One challenge we haven't tackled in this app is handling posts with dynamic heights. Calculating the start and end indexes when the post heights are unknown beforehand can be complex. It involves estimating initial post sizes and caching post heights as we fetch them. This is a task for future enhancements.

## Code Walkthrough

### App.js

In the `App.js` file, we set up the core of our application. Here's a breakdown of what happens:

- **Initialization**: We start by rendering the `VirtualRows` component, the heart of our infinite scroll mechanism.

- **Fetching Posts**: To keep our application responsive and efficient, we load posts in batches of 10. 

- **Custom Rendering**: The `cellRender` function is pivotal. It gets invoked by the `VirtualRow` component with `rowIndex` and `style` as parameters. This function is responsible for rendering individual post components at the specified index.

- **Loading New Posts**: The `attemptLoadingNewPosts` function is fired every time new rows are rendered. It has two primary cases:

  1. *Initial Load*: When posts are loaded for the first time, we fetch them in multiples of 10. For instance, if the end index is 24, we'll load a total of 30 posts.

  2. *Subsequent Loads*: On subsequent invocations, we check if `(endRowIndex + RowMargin)` is greater than or equal to the posts already loaded. If true, we initiate the `getBlogs` function.

- **Fetching Blogs**: The `getBlogs` function is responsible for fetching blogs and updating the blog count. As the row count updates, the `VirtualRow` component re-renders with the latest data.

### VirtualRows

In the `VirtualRows` component, we handle the dynamic rendering and scrolling logic. The key components and functions are outlined here:

- **RowManager**: We initialize a `rowManager`, which is an instance of `RowSizeAndPositionHandler`. This object handles all the calculations related to row sizes and positions.

- **Initial Rendering**: On the first render, we calculate the `scrollTop` value, which is the position of the scroll. Based on this value, we determine the range of rows visible in the viewport, specifically the `startIndex` and `endIndex`. This triggers the initial loading of posts via `attemptLoadingNewPosts`.

- **Managing Visible Rows**: We maintain a state variable called `visibleRowIndices` to keep track of the `startIndex` and `endIndex` of the rows currently in the viewport. This state updates as the user scrolls.

- **Scroll Handling**: The `handleGridScroll` function plays a crucial role. It updates the `startRow` and `endRow` indices if they differ from the current values. Additionally, it passes the new values to check if new posts need to be fetched.

- **Rendering Rows**: The `calculateRowToRender` function dynamically creates new row components based on the `startIndex` and `endIndex`. It calculates the offset of the start index, which represents the position from the top of the starting row.

### RowSizeAndPositionHandler

The `RowSizeAndPositionHandler` component contains the logic for computing row positions and ranges. It includes two important functions:

- **`getCellRangeInViewPortUnsafe`**: This function is used for the initial load, even if cells are not in the viewport. It's crucial for the initial data retrieval.

- **`getCellRangeInViewPort`**: This function provide the cell range that can be safely rendered in the viewport.
