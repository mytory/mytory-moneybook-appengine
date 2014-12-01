var MMB_Router = Backbone.Router.extend({

    routes: {
        "": 'start_page',
        "weekly(/:date)": 'weekly',
        "register(/:id)": 'register',
        "setting": 'setting',
        "import": 'import',
        "category/list(/:behavior_type/*path)": 'category_list',
        "category/add/:behavior_type": 'category1_add',
        "category/add/:behavior_type/*path": 'category2_add',
        "category/update/:behavior_type/*path": 'category_update',
        "statistics": 'statistics',
        "statistics/:year": 'statistics',
        "statistics/:year/:month": 'statistics',
        "transition": "transition",
        "account/list": "account_list",
        "account/add": "account_add",
        "account/update/*path": "account_update",
        "search(/*path)": "search",
        "export": "export"
    },

    initialize: function(){

        console.log('init start.');

        $('.js-mmb-version').text(MMB.version);
        MMB.show_loader();
        MMB.set_polyglot();
        console.log('set polyglot.');
        MMB.network_enabled = MMB.check_dropbox();
        console.log('network_enabled.');
        Backbone.history.start();
        console.log('history started.');

        console.log(MMB.network_enabled);

        if(MMB.network_enabled){
            MMB.add_lang_class_to_body();
            MMB.show_navbar();
            MMB.init_category_list();
            MMB.print_balance_panel();
        }

        $('.body').on('submit', 'form', function(){
            $(this).find('[required]:visible').each(function(){
                if($.trim($(this).val()) === ''){
                    alert(polyglot.t("Required field is missed!"));
                    $(this).focus();
                    return false;
                }
            });
        });

        $('.body').on('keyup', 'input[type="number"], input[type="tel"], .type-number', function(){
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        });
    },

    start_page: function(){
        location.href = "#register";
    },

    weekly: function(date) {

        if(date === undefined || date === null){
            date = moment().format('YYYY-MM-DD');
        }

        MMB.render('weekly', {
            date: date
        });
    },

    register: function(id){
        MMB.render('register', {
            id: id
        });
    },

    setting: function(){
        MMB.render('setting');
    },

    import: function(){
        MMB.render('import');
    },

    category_list: function(behavior_type, level1){
        var opt = {
            behavior_type: behavior_type,
            level1: (level1 ? level1 : null)
        };
        MMB.render('category_list', opt);
    },

    category1_add: function(behavior_type){
        MMB.render('category_add', {
            cat_level: 1,
            title: polyglot.t(behavior_type) + ' ' + polyglot.t('Add Category'),
            behavior_type: behavior_type,
            parent: null
        });
    },

    category2_add: function(behavior_type, parent){
        MMB.render('category_add', {
            behavior_type: behavior_type,
            cat_level: 2,
            title: parent + ' ' + polyglot.t('Add Category'),
            parent: parent
        });
    },

    category_update: function(behavior_type, cat){

        var cats = cat.split(':');

        MMB.render('category_update', {
            behavior_type: behavior_type,
            cat1: cats[0],
            cat2: cats[1]
        });
    },

    statistics: function(year, month){
        var vars = {
            key: 'whole_info',
            year: year,
            month: month
        };
        MMB.render('statistics', vars);
    },

    transition: function(year){
        MMB.render('transition', {
            year: year
        });
    },

    account_list: function(){
        MMB.render('account_list');
    },

    account_add: function(){
        MMB.render('account_add');
    },

    account_update: function(account){
        MMB.render('account_update', {
            account: account
        });
    },

    search: function(query){
        MMB.render('search', {
            query: query
        });
    },

    export: function(){
        MMB.render('export');
    }

});