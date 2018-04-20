var Grid = kendo.Class.extend({

    //Constructor
    init: function (gridName, clientId, clientName, columnModels, columnNames, jobMobility, boardId, domain) {
        this.Instance = this;

        if (gridName) {
            this.GridName = gridName;
            this.GridSelector = kendo.format("#{0}", this.GridName);
            this.GridElement = $(this.GridSelector);
            this.KendoGrid = this.GridElement.data("kendoGrid");
        }
        if (clientId) {
            this.ClientId = clientId;
        }
        if (clientName) {
            this.ClientName = clientName;
        }
        if (columnModels) {
            this.ColumnModels = columnModels;
        }
        if (columnNames) {
            this.ColumnNames = columnNames;
        }
        if (jobMobility) {
            this.JobMobility = jobMobility;
        }
        if (boardId) {
            this.BoardId = boardId;
        }
        if (domain) {
            this.Domain = domain;
        }
    },
    //End Construction
    //Properties
    Domain:null,
    GridElement:null,
    GridSelector:null,
    Instance: null,
    ClientId: null,
    ClientName: null,
    ColumnNames: null,
    GridName: null,
    KendoGrid: null,
    JobMobility: null,
    BoardId: null,
    DataSource: function () {
        if (!this.KendoGrid) {
            this.KendoGrid = this.GridElement.data("kendoGrid");
        }

        this.DataSource = this.KendoGrid.dataSource;

        return this.DataSource;
    },
    Filter: function() {
        if (this.DataSource) {
            return this.DataSource.filter();
        }

        return null;
    },
    ColumnModels: null,
    Grid: function () {
        if (!this.KendoGrid) {
            this.KendoGrid = this.GridElement.data("kendoGrid");
        }

        this.DataSource = this.KendoGrid.dataSource;

        return this.KendoGrid;
    },
    //End Properties

    //Methods
    GetColumnModels: function(that) {
        return that.ColumnModels;
    }, 
    UrlTitle: function(title) {
        return title.replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    },
    InsertPagerAtTop: function () {
        var grid = this.Grid();

        if (grid) {
            var table = this.GridElement.find(".k-grid-header-wrap").find("table[role=grid]");
            var wrapper = $('<div class="k-pager-wrap k-grid-pager pagerTop"/>').insertBefore(table);

            grid.pagerTop = new kendo.ui.Pager(wrapper, $.extend({}, grid.options.pageable, { dataSource: this.DataSource }));
            //grid.element.height("").find(".pagerTop").css({ "border-width": "0 0 1px 0", "width": "calc(100% - 3px)" });

            if ($(".k-filter-row").length > 0) {
                var reset = $("<a class=\"sf-toolbar sf-clear-filter k-link\" href=\"#\" title=\"Clear Filter\"><span class=\"k-icon k-i-funnel-clear\"></span></a>").on("click", this.ResetFilter);

                reset.insertAfter(".k-pager-refresh");
            }

            if (!kendo.support.mobileOS) {
                var anchor = $("<a class=\"sf-toolbar sf-show-filter k-link\" href=\"#\" title=\"Show Filter\"><span class=\"at-icon-wrapper sfi-link\"></span></a>").on("click", function(e) {

                    //TODO better way to reference owning instance
                    EventGrid.ShowFilter(EventGrid);
                });

                anchor.insertAfter(".k-pager-refresh");
            }
        }
    },
    ResetFilter: function () {
        if (/\/filter\//gi.test(location.pathname)) {
            location = kendo.format("{0}/Events/All", this.Domain);

            return;
        }

        $(".k-filter-row button[type='button']").trigger("click");
    },
    LaunchFilterUrlWindow: function (url, title) {
        var wnd = $("#url_wnd");

        var kw = wnd.data("kendoWindow");

        if (!kw) {
            wnd = $("#url_wnd");

            kw = wnd.kendoWindow({
                visible: false,
                title: title,
                actions: ['Close']
            }).data("kendoWindow");
        }
        
        $(".url-content").text(url);
        $("#url-content").val(url);

        kw.setOptions({
            title: title,
            visible: false
        });

        kw.open();

        $(".k-window").position({
            my: "right-10 top+10",
            of: event,
            collision: "fit"
        });

        return false;
    },
    ShowFilter: function(that) {
        this.LaunchFilterUrlWindow(this.GetFilterUrl(that), this.GetPageTitle(that));
    },
    GetPageTitle: function (that) {
        var kendoFilter = that.Filter();

        var filters = that.GetFilters(kendoFilter.filters);

        if (filters.length === 1 && location.pathname.toLowerCase() === "/events/all") {
            if (filters[0].field.toLowerCase() === "isexpired") {
                return kendo.format("All Events - {0}", that.ClientName);
            }
        }
        var filterValues = [];

        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i];
            var val = filter.value;
           
            if (filter.field.toLowerCase() === "isexpired") {
                if (typeof (val) === "boolean" || typeof (val) === "string") {
                    val = (val.toString().toLowerCase()==="false") ? "Current" : "Past";
                }
            }

            filterValues.push(val);
        }

        return kendo.format("{0} Events", filterValues.join(" - "));
    },
    GetFilterUrl: function (that) {
        function getFieldName(fieldName) {
            var models = that.ColumnModels;

            for (var i = 0; i < models.length; i++) {
                if (models[i].Name === fieldName) {
                    return models[i].IsCustom
                        ? models[i].Header
                        : models[i].Name;
                }
            }

            return null;
        };

        function encode(val) {
            if (typeof (val) === "string") {
                val = val
               .replace(/&/gi, "{amp}")
               .replace(/\?/gi, "{qm}")
               .replace(/\//gi, "{fs}")
               .replace(/\\/gi, "{bs}")
               .replace(/#/gi, "{hash}")
               .replace(/%/gi, "{percent}")
               .replace(/\*/gi, "{asterisk}");
            }

            return val;
        }

        var kendoFilter = this.Filter();

        if (!kendoFilter) return kendo.format("{0}/Events/All", this.Domain);

        var filters = this.GetFilters(kendoFilter.filters);
        var filterSegment = kendo.format("{0}/Events/Filter", this.Domain);
        var url = filterSegment;

        /*
        Encode reserved characters for us in url segment
        */
        for (var i = 0; i < filters.length; i++) {
            var val = filters[i].value;

            val = encode(val);

            var field = encode(getFieldName(filters[i].field));

            url += kendo.format("/{0}/{1}", encodeURIComponent(field), encodeURIComponent(val));
        }

        return url;
    },
    GetFilters: function (filters) {
        var _filters = [];

        if ($.isArray(filters)){
            for (var i=0; i < filters.length; i++) {
                var filters2 = this.GetFilters(filters[i]);

                if (filters2){
                    for (var j=0; j < filters2.length; j++) {
                        _filters.push(filters2[j]);
                    }
                }
            }
        }else if(typeof(filters)==="object")
        {
            if (filters.hasOwnProperty("field")) {
                return [filters];
            }

            return filters.filters;
        }

        return _filters;
    },
    /*
    PFM (5/5/2016) Search is not production ready
    */
    Search:function () {
        var gridListFilter = { filters: [] };
        var gridDataSource = this.DataSource;

        gridListFilter.logic = "or";   // a different logic 'or' can be selected

        var val = $("#keyword").val();

        if (val === "") {
            gridDataSource.filter(null);
            gridDataSource.read();

            return;
        }
        gridListFilter.filters.push({ field: "JobTitle", operator: "contains", value: val });
        gridListFilter.filters.push({ field: "City", operator: "contains", value: val });
        gridListFilter.filters.push({ field: "State", operator: "contains", value: val });
        gridListFilter.filters.push({ field: "Zip", operator: "contains", value: val });
        gridListFilter.filters.push({ field: "Country", operator: "contains", value: val });
        gridListFilter.filters.push({ field: "Company", operator: "contains", value: val });

        gridDataSource.filter(gridListFilter);
        gridDataSource.read();
    },
    Resize: function () {
        $(window).trigger("resize");
    }
    //End Methods
});

var customFilter = {
    url: null,
    title: null
}