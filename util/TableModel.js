function TableModel(definition) {

    let route;
    let columns;
    let columnMap = {};
    let defaultSort;

    init();

    function init() {
        route = definition.route;
        columns = definition.columns;
        columns.forEach(col => columnMap[col.key] = col);

        // Default sort
        defaultSort = definition.defaultSort ||
            {
                sortBy: columns[0].key,
                sortDir: 'asc'
            };
    }

    function getSort(req) {

        const sortBy = req.query.sortBy || defaultSort.sortBy;
        const sortDir = req.query.sortDir || defaultSort.sortDir;
        const column = columnMap[sortBy];
        const getter = column.getter || column.key;

        return {
            sortBy,
            sortDir,
            getter
        };
    }

    function getState(req) {

        const sort = getSort(req);
        const { sortBy, sortDir } = sort;

        const model = {
            columns: {}
        };

        columns.forEach(column => {

            const sortActive = sortBy === column.key;
            const nextSortDir = !sortActive || sortDir === 'desc'
                ? 'asc'
                : 'desc';
            const sortAsc = sortActive && sortDir === 'asc';
            const sortDesc = sortActive && sortDir === 'desc';
            const toggleSortLink = `${route}?sortBy=${column.key}&sortDir=${nextSortDir}`;

            model.columns[column.key] = {
                label: column.label || column.key,
                sortAsc,
                sortDesc,
                toggleSortLink
            };
        });

        return model;
    }

    return {
        getSort,
        getState
    };
}

module.exports = TableModel;
