# Setup instructions

```sh
npm install
```

an then;

```sh
npm run dev
```

My current node version:

```sh
v20.3.0
```

and npm version:

```sh
9.6.7
```

# Component Architecture

I decided to use a data source component to get data arrays from predefined json files or from copy/pasted JSON arrays.

> ⚠️ **Warning:** Changing selection between those options will reset all the filter and search data.

Another component which is placed next to the data source component is "Filter" component, which deduces the filtering fields by iterating through all data elements and
collect each of their fields to display corresponding input elements.
If filter component finds a "Date" field, then it displays 3 input fields for begin, end and exact matching of that date.

Data table and seacrh component are placed under those mentioned components.

Search and Filter directly affects the url to set the page state with a little delay.

You can also change the url to manually search/filter through data table.

And lastly I have added a "Add new record" button which opens a modal and get input from the user. Type of those input fields are deduced from each item in the data table.

Because that I did not use a global state management tool, I have stored those data in Component states.

Components which sets url (Filter/search) only updates the url and waits for DataTable component to read from the url and update itself. So this behavior seem slightly similar to dispatching actions and handled in the corresponding reducer.

> **Component architecture:** All data are saved and provided by "DataInput" component internal state and moved up to parent component (App) via callback on every update. This data is sent to "DataTable" component via props by its parent (App) and consumes this data to display on a table.
