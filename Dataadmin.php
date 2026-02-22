<?php
include 'db.php';

// ดึงชื่อทุกตารางจากฐานข้อมูล
$tables = [];
$result = $conn->query("SHOW TABLES");
while ($row = $result->fetch_array()) {
    $tables[$row[0]] = $row[0];
}

// เลือกตาราง
$selected_table = isset($_GET['table']) ? $_GET['table'] : array_key_first($tables);

// ดึงข้อมูลคอลัมน์และข้อมูล
$columns = [];
$data = [];
if (array_key_exists($selected_table, $tables)) {
    $result = $conn->query("SHOW COLUMNS FROM `$selected_table`");
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    $result = $conn->query("SELECT * FROM `$selected_table` LIMIT 100");
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// เพิ่มส่วนนี้หลัง $columns, $data
$user_stats = [];
if ($selected_table === 'users') {
    // ดึงจำนวนผู้สมัครรายวันย้อนหลัง 30 วัน
    $sql = "SELECT DATE(created_at) AS reg_date, COUNT(*) AS count 
            FROM users 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY reg_date
            ORDER BY reg_date ASC";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $user_stats['daily'][] = $row;
    }
    // ดึงจำนวนผู้สมัครรายเดือนย้อนหลัง 12 เดือน
    $sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') AS reg_month, COUNT(*) AS count 
            FROM users 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY reg_month
            ORDER BY reg_month ASC";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $user_stats['monthly'][] = $row;
    }
    // ดึงจำนวนผู้สมัครรายปีย้อนหลัง 5 ปี
    $sql = "SELECT YEAR(created_at) AS reg_year, COUNT(*) AS count 
            FROM users 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
            GROUP BY reg_year
            ORDER BY reg_year ASC";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $user_stats['yearly'][] = $row;
    }
}

$row_count = count($data);
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Admin Data Table</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/admin-table.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :host,
        html {
            -webkit-text-size-adjust: 100%; /* Safari, old Chrome, old Edge */
            text-size-adjust: 100%;         /* Chrome 54+, Chrome Android 54+, Edge 79+, Firefox, Safari */
        }
        .chart-btn-group .btn.active {
            background: #00CED1;
            color: #fff;
            border-color: #00CED1;
            box-shadow: 0 2px 8px rgba(0,206,209,0.12);
        }
        .chart-btn-group .btn {
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        #userChart {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            padding: 16px;
        }
        /* Hide caret except for search input (cross-browser) */
        input:not(#autoSearchInput):not([type="hidden"]),
        textarea:not(#autoSearchInput),
        .hide-caret:not(#autoSearchInput) {
            caret-color: transparent !important;
            -webkit-caret-color: transparent !important;
            -moz-caret-color: transparent !important;
        }
        /* For Safari (WebKit) */
        input:not(#autoSearchInput):not([type="hidden"])::-webkit-input-caret,
        textarea:not(#autoSearchInput)::-webkit-input-caret {
            color: transparent !important;
        }
    </style>
</head>
<body>
<div class="container py-4">
    <div class="d-flex justify-content-end mb-3">
        <a href="index2.html" class="btn btn-info" target="_blank">
            JASS
        </a>
    </div>
    
    <h1 class="mb-4 text-center">จัดการข้อมูล</h1>
    <!-- ปรับช่องค้นหาให้อยู่ในแถวเดียวกับเลือกตาราง -->
    <form method="get" class="mb-4 d-flex justify-content-center align-items-center gap-2 flex-wrap">
        <label class="fw-bold" for="table">เลือกตาราง:</label>
        <select name="table" id="table" class="form-select w-auto hide-caret" onchange="this.form.submit()">
            <?php foreach ($tables as $key => $label): ?>
                <option value="<?= $key ?>" <?= $selected_table == $key ? 'selected' : '' ?>><?= $label ?></option>
            <?php endforeach; ?>
        </select>
        <!-- ช่อง input autocomplete -->
        <div style="position:relative;max-width:220px;">
            <input type="text" id="autoSearchInput" class="form-control w-auto" style="max-width:220px;" placeholder="ค้นหา..." autocomplete="off">
            <ul id="autoSearchList" class="list-group position-absolute w-100" style="z-index:10;display:none;max-height:200px;overflow-y:auto;"></ul>
        </div>
        <noscript><button type="submit" class="btn btn-primary hide-caret">แสดง</button></noscript>
    </form>
    <div class="table-responsive shadow rounded">
        <table class="table table-striped table-hover align-middle" id="data-table">
            <thead class="table-dark">
            <tr>
                <?php foreach ($columns as $col): ?>
                    <th><?= htmlspecialchars($col) ?></th>
                <?php endforeach; ?>
                <!-- ลบ <th>แก้ไข</th> ออก -->
            </tr>
            </thead>
            <tbody>
            <?php foreach ($data as $row): ?>
                <tr data-row='<?= htmlspecialchars(json_encode($row), ENT_QUOTES, "UTF-8") ?>'>
                    <?php foreach ($columns as $col): ?>
                        <td><?= htmlspecialchars(mb_strimwidth($row[$col], 0, 50, "...")) ?></td>
                    <?php endforeach; ?>
                    <!-- ลบ <td><button ... class="edit-article-btn" ...>แก้ไข</button></td> ออก -->
                </tr>
            <?php endforeach; ?>
            <?php if (empty($data)): ?>
                <tr><td colspan="<?= count($columns) ?>" class="text-center text-muted">ไม่มีข้อมูล</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <!-- ย้ายปุ่มมาที่นี่ (ก่อนกราฟ) -->
    <div class="d-flex justify-content-end gap-2 mt-3">
        <button class="btn btn-success" id="addBtn">เพิ่มข้อมูล</button>
        <button class="btn btn-warning" id="editBtn" disabled>แก้ไข</button>
        <button class="btn btn-danger" id="deleteBtn" disabled>ลบ</button>
    </div>
    <!-- กราฟแบบคู่ (responsive) -->
    <div class="row my-4 justify-content-center align-items-stretch g-3">
        <div class="col-md-6 d-flex">
            <div class="card shadow rounded flex-fill h-100" style="max-width:480px;width:100%;margin:auto;">
                <div class="card-body d-flex flex-column justify-content-center h-100">
                    <h5 class="card-title text-center mb-2">จำนวนข้อมูลในตาราง <span class="text-info"><?= htmlspecialchars($selected_table) ?></span></h5>
                    <canvas id="tableDonutChart" width="340" height="200"></canvas>
                    <div class="text-center mt-2 fw-bold text-success" style="font-size:1.2rem;">
                        <?= $row_count ?> รายการ
                    </div>
                </div>
            </div>
        </div>
        <?php if ($selected_table === 'users'): ?>
        <div class="col-md-6 d-flex">
            <div class="card shadow rounded flex-fill h-100" style="max-width:480px;width:100%;margin:auto;">
                <div class="card-body d-flex flex-column justify-content-center h-100">
                    <h5 class="mb-2 text-center">กราฟจำนวนผู้สมัครสมาชิก</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span id="chartLabel" class="fw-bold text-info">รายวัน (30 วันล่าสุด)</span>
                        <div class="dropdown">
                            <button class="btn btn-outline-info dropdown-toggle" type="button" id="chartTypeDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <span id="chartTypeText">รายวัน</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="chartTypeDropdown">
                                <li><a class="dropdown-item" href="#" data-type="daily">รายวัน</a></li>
                                <li><a class="dropdown-item" href="#" data-type="monthly">รายเดือน</a></li>
                                <li><a class="dropdown-item" href="#" data-type="yearly">รายปี</a></li>
                            </ul>
                        </div>
                    </div>
                    <canvas id="userChart" width="340" height="200"></canvas>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>
</div>

<!-- Modal เพิ่มข้อมูล -->
<div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <!-- เปลี่ยน action ให้กลับมาหน้า Dataadmin.php หลังเพิ่มข้อมูล -->
    <form class="modal-content" id="addForm" method="post" action="add_action.php">
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title" id="addModalLabel">เพิ่มข้อมูล</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="ปิด"></button>
      </div>
      <div class="modal-body" id="addModalBody">
        <!-- ฟอร์มจะถูกเติมโดย JS -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
        <button type="submit" class="btn btn-success">เพิ่มข้อมูล</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal แก้ไขข้อมูล -->
<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content" id="editForm" method="post" action="edit.php">
      <div class="modal-header bg-warning">
        <h5 class="modal-title" id="editModalLabel">แก้ไขข้อมูล</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="ปิด"></button>
      </div>
      <div class="modal-body" id="editModalBody">
        <!-- ฟอร์มจะถูกเติมโดย JS -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
        <button type="submit" class="btn btn-warning">บันทึก</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal ยืนยันลบ -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="deleteModalLabel">ยืนยันการลบข้อมูล</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="ปิด"></button>
      </div>
      <div class="modal-body">
        <p>คุณต้องการลบข้อมูลนี้หรือไม่?<br>
        <span class="text-danger fw-bold">กรุณารอ <span id="countdown">3</span> วินาที เพื่อยืนยัน</span></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
        <a href="#" id="confirmDeleteBtn" class="btn btn-danger disabled">ลบ</a>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
// เลือกแถว
let selectedRow = null;
document.querySelectorAll('#data-table tbody tr').forEach(tr => {
    tr.addEventListener('click', function() {
        document.querySelectorAll('#data-table tbody tr').forEach(r => r.classList.remove('table-primary'));
        this.classList.add('table-primary');
        selectedRow = this;
        document.getElementById('editBtn').disabled = false;
        document.getElementById('deleteBtn').disabled = false;
    });
});

// ปุ่มแก้ไข
document.getElementById('editBtn').addEventListener('click', function() {
    if (!selectedRow) return;
    const row = JSON.parse(selectedRow.getAttribute('data-row'));
    const table = "<?= $selected_table ?>";
    const columns = <?php echo json_encode($columns); ?>;
    let html = '<div class="container-fluid"><div class="row">';
    let colCount = 0;
    let firstKey = '';
    for (let i = 0; i < columns.length; i++) {
        const key = columns[i];
        if (!firstKey) firstKey = key;
        const value = row[key] ?? '';
        const readonly = (key === firstKey) ? 'readonly' : '';
        if (colCount % 2 === 0) html += '<div class="row mb-3">';
        html += `
            <div class="col-6">
                <label class="form-label fw-bold">${key}</label>
                <input type="text" class="form-control" name="${key}" value="${value}" ${readonly} data-field="${key}">
                ${readonly ? '<div class="form-text text-danger">* ห้ามแก้ไข</div>' : ''}
                ${table === 'articles' && key === 'community_name' ? `
                    <div class="form-text text-warning d-none" id="warn-community_name">
                        การแก้ไข community_name จะมีผลกับการเชื่อมโยงบทความกับชุมชน หากชื่อไม่ตรงกับ name ในตาราง communities จะไม่สามารถแสดงบทความในชุมชนนั้นได้
                    </div>
                ` : ''}
                ${table === 'communities' && key === 'name' ? `
                    <div class="form-text text-warning d-none" id="warn-name">
                        การแก้ไข name จะมีผลกับการเชื่อมโยงข้อมูลทุกอย่างที่อ้างอิงชื่อนี้ เช่น บทความหรือเสียง หากเปลี่ยนชื่อ ข้อมูลที่เชื่อมโยงด้วยชื่อเดิมจะไม่แสดงผล
                    </div>
                ` : ''}
            </div>
        `;
        colCount++;
        if (colCount % 2 === 0) html += '</div>';
    }
    if (colCount % 2 !== 0) html += '</div>'; // ปิดแถวสุดท้ายถ้าไม่ครบคู่
    html += '</div></div>';
    html += `<input type="hidden" name="table" value="${table}">`;
    html += `<input type="hidden" name="id" value="${row[firstKey]}">`;
    document.getElementById('editModalBody').innerHTML = html;
    let modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();

    // เพิ่ม event แจ้งเตือนเมื่อ focus ที่ช่อง community_name หรือ name
    if (table === 'articles') {
        const input = document.querySelector('input[name="community_name"]');
        const warn = document.getElementById('warn-community_name');
        if (input && warn) {
            input.addEventListener('focus', () => { warn.classList.remove('d-none'); });
            input.addEventListener('blur', () => { warn.classList.add('d-none'); });
        }
    }
    if (table === 'communities') {
        const input = document.querySelector('input[name="name"]');
        const warn = document.getElementById('warn-name');
        if (input && warn) {
            input.addEventListener('focus', () => { warn.classList.remove('d-none'); });
            input.addEventListener('blur', () => { warn.classList.add('d-none'); });
        }
    }
});

// ปุ่มลบ
let deleteUrl = '';
let countdownInterval;
let countdown = 3;

document.getElementById('deleteBtn').addEventListener('click', function() {
    if (!selectedRow) return;
    const row = JSON.parse(selectedRow.getAttribute('data-row'));
    const table = "<?= $selected_table ?>";
    const id = Object.values(row)[0];
    deleteUrl = `delete.php?table=${table}&id=${id}`;
    document.getElementById('confirmDeleteBtn').classList.add('disabled');
    document.getElementById('confirmDeleteBtn').setAttribute('href', '#');
    document.getElementById('countdown').textContent = '3';
    countdown = 3;
    let modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
    countdownInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('confirmDeleteBtn').classList.remove('disabled');
            document.getElementById('confirmDeleteBtn').setAttribute('href', deleteUrl);
        }
    }, 1000);
    document.getElementById('deleteModal').addEventListener('hidden.bs.modal', function () {
        clearInterval(countdownInterval);
    }, { once: true });
});

// ปุ่มเพิ่มข้อมูล
document.getElementById('addBtn').addEventListener('click', function() {
    const columns = <?php echo json_encode($columns); ?>;
    let html = '<div class="container-fluid"><div class="row">';
    // สร้างฟอร์มแบบสองคอลัมน์ ยกเว้นฟิลด์ที่ไม่ต้องกรอก
    let colCount = 0;
    for (let i = 0; i < columns.length; i++) {
        const colName = columns[i].toLowerCase();
        if (
            colName.endsWith('_id') ||
            colName === 'created_at' ||
            colName === 'last_login' ||
            colName === 'reset_token' ||
            colName === 'reset_token_expiry'
        ) continue;
        if (colCount % 2 === 0) html += '<div class="row mb-3">';
        html += `
            <div class="col-6">
                <label class="form-label fw-bold">${columns[i]}</label>
                <input type="text" class="form-control" name="${columns[i]}" value="">
            </div>
        `;
        colCount++;
        if (colCount % 2 === 0) html += '</div>';
    }
    if (colCount % 2 !== 0) html += '</div>'; // ปิดแถวสุดท้ายถ้าไม่ครบคู่
    html += '</div></div>';
    html += `<input type="hidden" name="table" value="<?= $selected_table ?>">`;
    document.getElementById('addModalBody').innerHTML = html;
    let modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
});

// สร้างรายการคำทั้งหมดจากตาราง
const allWords = [];
document.querySelectorAll('#data-table tbody tr').forEach(tr => {
    tr.querySelectorAll('td').forEach(td => {
        const txt = td.textContent.trim();
        if (txt && !allWords.includes(txt)) allWords.push(txt);
    });
});

// autocomplete dropdown
const autoInput = document.getElementById('autoSearchInput');
const autoList = document.getElementById('autoSearchList');
autoInput.addEventListener('input', function() {
    const filter = this.value.trim().toLowerCase();
    autoList.innerHTML = '';
    if (!filter) {
        autoList.style.display = 'none';
        // แสดงทุกแถว
        document.querySelectorAll('#data-table tbody tr').forEach(tr => tr.style.display = '');
        return;
    }
    // หาเฉพาะคำที่ตรง
    const matches = allWords.filter(w => w.toLowerCase().includes(filter));
    if (matches.length) {
        matches.slice(0, 20).forEach(word => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action py-1 px-2';
            li.textContent = word;
            li.onclick = function() {
                autoInput.value = word;
                autoList.style.display = 'none';
                // กรองแถวในตาราง
                document.querySelectorAll('#data-table tbody tr').forEach(tr => {
                    let show = false;
                    tr.querySelectorAll('td').forEach(td => {
                        if (td.textContent.trim() === word) show = true;
                    });
                    tr.style.display = show ? '' : 'none';
                });
            };
            autoList.appendChild(li);
        });
        autoList.style.display = '';
    } else {
        autoList.style.display = 'none';
    }
    // กรองแถวในตารางตามข้อความที่พิมพ์
    document.querySelectorAll('#data-table tbody tr').forEach(tr => {
        let show = false;
        tr.querySelectorAll('td').forEach(td => {
            if (td.textContent.toLowerCase().includes(filter)) show = true;
        });
        tr.style.display = show ? '' : 'none';
    });
});
// ซ่อน dropdown เมื่อคลิกนอก
document.addEventListener('click', function(e) {
    if (!autoInput.contains(e.target) && !autoList.contains(e.target)) {
        autoList.style.display = 'none';
    }
});

<?php if ($selected_table === 'users'): ?>
const userStats = {
    daily: {
        labels: <?= json_encode(array_column($user_stats['daily'] ?? [], 'reg_date')) ?>,
        data: <?= json_encode(array_column($user_stats['daily'] ?? [], 'count')) ?>,
        label: "รายวัน (30 วันล่าสุด)",
        color: "#00CED1"
    },
    monthly: {
        labels: <?= json_encode(array_column($user_stats['monthly'] ?? [], 'reg_month')) ?>,
        data: <?= json_encode(array_column($user_stats['monthly'] ?? [], 'count')) ?>,
        label: "รายเดือน (12 เดือนล่าสุด)",
        color: "#FF7F50"
    },
    yearly: {
        labels: <?= json_encode(array_column($user_stats['yearly'] ?? [], 'reg_year')) ?>,
        data: <?= json_encode(array_column($user_stats['yearly'] ?? [], 'count')) ?>,
        label: "รายปี (5 ปีล่าสุด)",
        color: "#36454F"
    }
};
let currentType = 'daily';
const ctx = document.getElementById('userChart').getContext('2d');
let userChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: userStats.daily.labels,
        datasets: [{
            label: 'จำนวนผู้สมัคร',
            data: userStats.daily.data,
            backgroundColor: userStats.daily.color
        }]
    },
    options: {
        scales: { x: { ticks: { color: '#36454F' } }, y: { beginAtZero: true } },
        plugins: { legend: { display: false } }
    }
});
function updateChart(type) {
    userChart.data.labels = userStats[type].labels;
    userChart.data.datasets[0].data = userStats[type].data;
    userChart.data.datasets[0].backgroundColor = userStats[type].color;
    document.getElementById('chartLabel').textContent = userStats[type].label;
    document.getElementById('chartTypeText').textContent = 
        type === 'daily' ? 'รายวัน' : (type === 'monthly' ? 'รายเดือน' : 'รายปี');
    userChart.update();
}
document.querySelectorAll('.dropdown-menu [data-type]').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        updateChart(this.getAttribute('data-type'));
    });
});
<?php endif; ?>

// กราฟโดนัทจำนวนข้อมูลในตาราง
const donutCtx = document.getElementById('tableDonutChart').getContext('2d');
new Chart(donutCtx, {
    type: 'doughnut',
    data: {
        labels: ['จำนวนข้อมูล', 'ว่าง'],
        datasets: [{
            data: [<?= $row_count ?>, Math.max(0, 100 - <?= $row_count ?>)],
            backgroundColor: ['#00CED1', '#e5e7eb'],
            borderWidth: 2
        }]
    },
    options: {
        plugins: {
            legend: { display: false }
        },
        cutout: '70%',
    }
});
</script>
</body>
</html>