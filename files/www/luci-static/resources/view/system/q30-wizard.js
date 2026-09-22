'use strict';
'require view';
'require dom';
'require ui';

return view.extend({
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,

	render: function () {
		var frame = E('iframe', {
			'id': 'q30-wizard-frame',
			'src': L.url('cgi-bin', 'wizard') + '?op=page',
			'style': 'width:100%;min-height:900px;height:1100px;border:0;background:transparent;display:block',
			'frameborder': '0',
			'scrolling': 'no'
		});

		// 向导页在完成设置后不会再变化，高度只需在加载完成后同步一次
		frame.addEventListener('load', function () {
			try {
				var d = frame.contentDocument;
				if (d && d.body) {
					var h = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
					if (h > 200)
						frame.style.height = (h + 40) + 'px';
				}
			} catch (e) { /* 跨域或未就绪：保留默认高度 */ }
		});

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', { 'name': 'content' }, [ _('快速设置向导') ]),
			E('div', { 'class': 'cbi-map-descr' }, [
				_('设置路由器管理密码、上网方式，以及 Wi-Fi 名称与密码。填写后点击「完成设置」即可生效。')
			]),
			frame
		]);
	}
});
