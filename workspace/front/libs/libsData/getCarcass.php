<?php
session_start();
if(isset($_SESSION['u_id'])) {
	echo json_encode(
			[
				'tpl'=> '<core-body class="core-in">
									<core-menu></core-menu>
									<core-head></core-head>
									<core-content data-scroll-action="Animation:scrollContent">
										<div class="page-head"></div>
										<div class="page-body"></div>
									</core-content>
								</core-body>'
		]
	);
}else{
	echo json_encode(
			[
					'tpl'=> '<core-body></core-body>'
			]
	);
}