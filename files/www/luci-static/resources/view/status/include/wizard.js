'use strict';
'require view';

// 首页「快速设置」入口卡片
// 命名约束：/www/luci-static/resources/view/status/include/*.js 由 index.js 按字典序
// 通过 require('view.status.include.' + 文件名) 加载，文件名必须是合法 JS 标识符片段。
// 取 "wizard" 可排在 10_system.js 之前（'w' > '1'），因此总是显示在首页最上方。

return view.extend({
	render: function () {
		var card = E('div', { 'class': 'cbi-section', 'id': 'q30-wizard-entry' }, [
			E('h3', {}, [ _('快速设置向导') ]),
			E('div', { 'class': 'cbi-section-descr' }, [
				_('初次使用，或需要修改上网方式、Wi-Fi 名称与密码时，可通过向导一键完成配置。')
			]),
			E('div', { 'style': 'margin-top:12px' }, [
				E('a', {
					'class': 'btn cbi-button cbi-button-apply',
					'href': L.url('admin', 'system', 'q30-wizard'),
					'style': 'text-decoration:none'
				}, [ _('打开快速设置向导') ])
			])
		]);

		// 尚未完成首次设置时追加提示条
		fetch(L.url('cgi-bin', 'wizard') + '?op=state', { cache: 'no-store' })
			.then(function (r) { return r.json(); })
			.then(function (s) {
				if (s && !s.done && s.firstboot) {
					card.insertBefore(
						E('div', { 'class': 'alert-message warning' }, [
							_('路由器尚未完成首次设置，建议立即运行快速设置向导。')
						]),
						card.firstChild
					);
				}
			})
			.catch(function () { /* 静默失败：入口按钮本身始终可用 */ });

		return card;
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
