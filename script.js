// Cuộn mượt đến section với hiệu ứng mượt hơn
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
  element.style.animation = "bounce 0.5s ease-in-out";
  setTimeout(() => (element.style.animation = ""), 500);
}

// Tìm địa điểm hiến máu (sử dụng Google Maps API)
function initMap() {
  const quyNhonLocation = { lat: 13.7824, lng: 109.2193 }; // Tọa độ Khu đô thị mới An Phú Thịnh, Quy Nhơn
  const map = new google.maps.Map(document.getElementById("map"), {
    center: quyNhonLocation,
    zoom: 15,
  });

  const marker = new google.maps.Marker({
    position: quyNhonLocation,
    map: map,
    title: "FPT University Quy Nhơn Blood Donation Drive",
  });

  // Tìm địa điểm dựa trên input
  function findDrive() {
    const locationInput = document.getElementById("locationInput").value.trim();
    const mapFamer = document.getElementById("mapFamer");
    const result = document.getElementById("result");
    if (!locationInput) {
      result.textContent = "Please enter a location.";
      return;
    }
    const q = encodeURIComponent(locationInput);
    const url = `https://www.google.com/maps?q=${q}&output=embed`;
    mapFrame.src = url;

    result.textContent = `Showing results for: "${locationInput}"`;
  }
}

// Hiệu ứng khi cuộn (scroll reveal với animation phức tạp)
window.addEventListener("scroll", () => {
  const elements = document.querySelectorAll(
    ".about, .find-drive, .donate, .eligibility, .stories, .contact"
  );
  elements.forEach((el) => {
    const position = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (position < windowHeight - 100) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.animation = "slideUp 1s ease-out";
    }
  });
});

function submitContact(event) {
  event.preventDefault();
  const form = document.getElementById("contactForm");
  const formData = new FormData(form);

  formData.append("action", "contact");

  fetch("server.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      form.style.transform = "scale(0.95)";
      setTimeout(() => {
        alert(data.message);
        form.style.transform = "scale(1)";
        form.reset();
      }, 200);
    })
    .catch((error) => {
      alert("Error submitting form. Please try again.");
      form.style.transform = "scale(1)";
    });
}

// Gửi form đăng ký hiến máu (AJAX với backend PHP)


// // Mở form giả lập (có thể thay bằng popup thực tế với hiệu ứng)
// function openDonationForm() {
//     const button = document.querySelector('.pulse');
//     button.style.animation = 'pulseFast 0.5s infinite';
//     const form = document.getElementById('donationForm');
//     form.style.display = form.style.display === 'block' ? 'none' : 'block';
//     setTimeout(() => {
//         button.style.animation = 'pulse 2s infinite';
//     }, 300);
// }
function openDonationForm() {
  document.getElementById("donationForm").style.display = "block";
}

async function submitDonor(event) {
  event.preventDefault();

  const form = document.getElementById("donorForm");
  const formData = new FormData(form);

  const donor = {
    name: formData.get("name"),
    email: formData.get("email"),
    location: formData.get("location"),
    blood_type: formData.get("blood_type"), // Bổ sung thêm nhóm máu
  };

  try {
    const response = await fetch("http://localhost:5000/api/donors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donor),
    });

    const result = await response.json();

    if (response.ok) {
      showToast(
        result.message || "Bạn đã đăng ký hiến máu thành công!",
        "success"
      );
      form.reset();
      document.getElementById("donationForm").style.display = "none";
    } else {
      showToast(result.message || "Đăng ký thất bại.", "error");
    }
  } catch (err) {
    showToast("Kết nối thất bại. Vui lòng thử lại.", "error");
  }
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

async function loadTopDonors() {
  try {
    const response = await fetch("http://localhost:5000/api/donors/top");

    // Kiểm tra mã trạng thái của phản hồi
    if (!response.ok) {
      throw new Error(`Server trả về mã lỗi: ${response.status}`);
    }

    const topDonors = await response.json();

    const tbody = document.querySelector("#rankingTable tbody");
    tbody.innerHTML = ""; // Xóa nội dung hiện tại của bảng

    // Kiểm tra xem có người hiến máu nào đủ điều kiện không
    if (topDonors.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4">Không có người nào hiến từ 3 lần trở lên.</td></tr>';
      return;
    }

    // Lặp qua danh sách người hiến máu và tạo các dòng trong bảng
    topDonors.forEach((donor, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${donor.name}</td>
                <td>${donor.email}</td>
                <td>${donor.donationCount}</td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi tải bảng xếp hạng:", error);
    alert(
      "Không thể tải bảng xếp hạng. Vui lòng kiểm tra kết nối hoặc thử lại sau."
    );
  }
}

window.onload = loadTopDonors;

// Animations mới
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    @keyframes fadeInBounce {
        0% { opacity: 0; transform: translateY(20px); }
        50% { opacity: 0.5; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseFast {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }

        
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(styleSheet);

async function fetchAndRenderChart() {
  try {
    const response = await fetch('http://localhost:5000/api/donors/stats/by-day-and-blood-type');
    const data = await response.json();

    // Lấy tất cả ngày và nhóm máu duy nhất
    const dates = [...new Set(data.map(item => item.date))];
    const bloodTypes = [...new Set(data.map(item => item.blood_type))];

    // Chuẩn bị dữ liệu cho từng nhóm máu
    const datasets = bloodTypes.map((bloodType, index) => {
      const color = `hsl(${(index * 50) % 360}, 70%, 60%)`;
      return {
        label: bloodType,
        data: dates.map(date => {
          const item = data.find(d => d.date === date && d.blood_type === bloodType);
          return item ? item.count : 0;
        }),
        backgroundColor: color,
      };
    });

    // Vẽ biểu đồ
    const ctx = document.getElementById('bloodChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Số người hiến máu theo ngày và loại máu'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Số người hiến'
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu biểu đồ:', error);
  }
}

fetchAndRenderChart();