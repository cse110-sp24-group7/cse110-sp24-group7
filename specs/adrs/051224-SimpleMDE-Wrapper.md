---
# status: accepted
# date: 05-12-2024
---

# Use SimpleMDE as a wrapper for our journal entries.

## Context and Problem Statement

One of the features of our product is that the journal entries should be formattable using M$arkdown. This is a crucial feature to our product, since developers often need to format their notes and store code segments. Markdown is a syntax that every developer can use, whether they are fluent in it or not. Thus, within the scope of this decision, we posed the following question (only one was necessary, as this encapsulates all the key ideas for the feature):

- How do we easily integrate Markdown formatting within our journal within a feasible timeframe?

## Considered Options

- SimpleMDE wrapper
- CKEditor wrapper
- Custom Markdown editor

## Decision Outcome

Chosen option: SimpleMDE, because we want to ultimately minimize complexity, while providing the basic benefit of Markdown editing to the user. The other wrapper options presented were not as viable, and the idea of creating a custom Markdown editor was considered but proved too large an undertaking to be feasible to the product.

## Pros and Cons of the Options Considered

### SimpleMDE

- Pro: Simplicity. SimpleMDE is designed to be easy to use and integrate into web applications, which is ideal for our developing needs for the scope of this feature.
- Pro: Live feedback. SimpleMDE provides a live preview of the Markdown formatted text as the user types, which is an extremely useful feature.
- Pro: Customizable. SimpleMDE allows the developers to customize the editor's appearance and behavior, which would allow us to style it towards our website's theme.
- Pro: Testimony from trusted opinions. When pitching our product to our advisory TA, he said that he has used SimpleMDE in the past and has found it very useful. We trust his opinion, and thus wish to proceed with the same approach.
- Neutral: Limited features compared to other editors. SimpleMDE does not allow for specific features that other editors may allow, such as collaborative editing. This is not an issue for us, since we do not foresee this becoming a feature in our product at any point.

### CKEditor

- Pro: Rich Text Editing. Provides a rich set of editing features, allowing for users to apply advanced formatting options. We consider this to be useful, but not necessary given the tradeoffs complexity-wise.
- Pro: Added features. CKEditor allows for collaborative editing and is highly customizable, which is definitely an advantage for specific situations. However, none of these apply to our product.
- Con: Complexity. CKEditor is very complex to set up and integrate, especially for our product which has simple editing needs.
- Con: Performance. The rich feature set of CKEditor would impact this feature's performance on our application, especially on slower devices. We want to build our application to be usable to all types of devices, and we've learnt in class greatly how discrimination based on device speeds is an undesirable feature in SE.

### Custom Markdown Editor

- Pro: Customizability, tailoring to the product. Developing our own MD editor would allow us to specify it exactly towards our product, providing the best integration and features possible.
- Con: Set-up and time investment. This would be an extremely lengthy feature to implement, and we were advised not to dedicate too many resources into this feature. Given that it is not the primary focus of our product, and just a quality of life improvement, we decided that the time investment was not worth it.
