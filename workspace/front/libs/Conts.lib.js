let
    d = document;
    d.query = d.querySelector;
    d.create = d.createElement;
    let systemConts = {
        'content': d.query('core-content') ? d.query('core-content') : d.create('core-content'),
        'main': d.query('core')      ? d.query('core')      : d.create('core'),
        'head': d.query('core-head') ? d.query('core-head') : d.create('core-head'),
        'body': d.query('core-body') ? d.query('core-body') : d.create('core-body'),
        'foot': d.query('core-foot') ? d.query('core-foot') : d.create('core-foot'),
        'menu': d.query('core-menu') ? d.query('core-menu') : d.create('core-menu')
    };


export { systemConts }
