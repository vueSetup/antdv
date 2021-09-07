## Design Ideas

For almost any business, what we do is actually define a series of behaviors based on a state, take the table above as an example, first we need a state `dataSource` for storing the data requested from the server, and for optimizing the experience, we also need a `loading`. So we have a series of behaviors, we need to set `loading=true` first, then launch a network request, after the network request is completed, set `dataSource` for the requested data, `loading=false`, a network request is completed, although very simple, but a business system has a considerable number of tables But a business system has a lot of tables, and each table is defined so once, the workload is very large.

If you want to re-request the network, we need to encapsulate the behavior, the above behavior into a method, click to reload the data, if you have paging, then you need a new variable page, we need to go before the re-request according to the need to determine whether to reset the page to the first page, which introduces another variable. If your form also has to control the number of pages per page, then it will be even more cumbersome. This kind of repetitive work can waste a lot of our time.

### One state plus a series of behaviors

The above logic exists in almost all middle and backend development, each added state requires a series of behaviors to manage, and each behavior can be complex if coupled with too many states.

Based on the same idea, ProTable wants to abstract a layer to solve the problem of complex state. The most common states in table are `loading` and `dataSource`, including the extended `page`, `pageSize`, which are actually So table abstracts a `request` api that encapsulates the loading and dataSource states and all their behaviors, such as previous page, next page, refresh, modify per-page size, and so on.

This wrapping pattern allows the front-end to get away from all kinds of state management and focus on business development, and is more intuitive without the need for data flow solutions like dva, redux, etc. The developer only needs to define a state and the heavy component will automatically generate a set of behaviors.

> For incremental use we also provide the same api as [Ant Design of Vue](https://2x.antdv.com/components/overview/), which can be completely downgraded to an Ant Design Vue table.

### A component ≈ a page

Heavy components differ from traditional components in that they are abstracted as a page, so ProTable supports network requests and automatic query form generation, while ProLayout supports automatic menu generation, both based on the same idea of providing page-level abstraction.

A list page should be done with ProLayout + ProTable, an edit page should be done with ProLayout + ProForm, and a detail page can be done with ProLayout + ProDescriptions. A page only needs to focus on a few heavy components in the development project, reducing the mental load and focusing on the more core business logic.
