export type ButtonActionType =
  | "state-toggle"
  | "state-toggle/cart-quantity"
  | "navigation"
  | "native-file-picker"
  | "navigation/back"
  | "action"
  | "quantity-control"
  | "delete-action"
  | "checkout-action"
  | "navigation/detail"
  | "cancel-action"
  | "navigation/membership"
  | "filter-action"
  | "confirm-action";

export type ButtonAsset = {
  id: ButtonId;
  src: string;
  fileName: string;
  label: string;
  actionType: ButtonActionType;
  originalFunction: string;
  state: {
    default: string;
    active?: string;
    afterClick?: string;
    click?: string;
  };
  developerNote: string;
};

export type ButtonId =
  | "button-001"
  | "button-002"
  | "button-003"
  | "button-004"
  | "button-005"
  | "button-006"
  | "button-007"
  | "button-008"
  | "button-009"
  | "button-010"
  | "button-011"
  | "button-012"
  | "button-013"
  | "button-014"
  | "button-015"
  | "button-016"
  | "button-017"
  | "button-018"
  | "button-019"
  | "button-020"
  | "button-021"
  | "button-022"
  | "button-023"
  | "button-024"
  | "button-025"
  | "button-026"
  | "button-027";

function createButtonAsset(
  id: ButtonId,
  label: string,
  actionType: ButtonActionType,
  originalFunction: string,
  state: ButtonAsset["state"],
  developerNote: string
): ButtonAsset {
  const fileName = `${id}.png`;

  return {
    id,
    src: `/assets/buttons/${fileName}`,
    fileName,
    label,
    actionType,
    originalFunction,
    state,
    developerNote
  };
}

export const buttonAssets: Record<ButtonId, ButtonAsset> = {
  "button-001": createButtonAsset(
    "button-001",
    "Nút thả tim",
    "state-toggle",
    "Khi nhấn vào thì trái tim chuyển sang màu tím, stroke trắng giữ nguyên.",
    {
      default: "button-001.png",
      active: "Vẫn là nút thả tim nhưng trái tim chuyển sang màu tím, stroke trắng giữ nguyên."
    },
    "Giữ nguyên logic favorite hiện có. Chỉ map đúng asset và trạng thái active."
  ),
  "button-002": createButtonAsset(
    "button-002",
    "Nút thêm món",
    "state-toggle/cart-quantity",
    "Khi nhấn vào dấu cộng thì nút từ dấu cộng chuyển sang trạng thái - 1 +.",
    {
      default: "button-002.png",
      afterClick: "Nút từ dấu cộng chuyển sang trạng thái - 1 +."
    },
    "Giữ nguyên logic thêm món/giỏ hàng hiện có. Không tạo logic cart mới nếu project đã có sẵn."
  ),
  "button-003": createButtonAsset(
    "button-003",
    "Nút scan",
    "navigation",
    "Khi nhấn nút thì nút dẫn đến trang scan.",
    {
      default: "button-003.png",
      click: "Dẫn đến trang scan."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-004": createButtonAsset(
    "button-004",
    "Nút home",
    "navigation",
    "Khi nhấn nút thì nút dẫn về trang chính home.",
    {
      default: "button-004.png",
      click: "Dẫn về trang chính home."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-005": createButtonAsset(
    "button-005",
    "Nút tim",
    "navigation",
    "Khi nhấn vào thì nút dẫn đến trang trữ các công thức, nguyên liệu đã được thả tim.",
    {
      default: "button-005.png",
      click: "Dẫn đến trang trữ các công thức, nguyên liệu đã được thả tim."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-006": createButtonAsset(
    "button-006",
    "Nút thông báo",
    "navigation",
    "Khi nhấn vào thì nút dẫn đến trang thông báo các tin mới.",
    {
      default: "button-006.png",
      click: "Dẫn đến trang thông báo các tin mới."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-007": createButtonAsset(
    "button-007",
    "Nút lịch sử",
    "navigation",
    "Khi nhấn vào thì nút dẫn đến trang lịch sử các món đã xem.",
    {
      default: "button-007.png",
      click: "Dẫn đến trang lịch sử các món đã xem."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-008": createButtonAsset(
    "button-008",
    "Nút thư viện ảnh",
    "native-file-picker",
    "Khi nhấn vào thì nút dẫn đến thư viện ảnh trong máy bạn.",
    {
      default: "button-008.png",
      click: "Dẫn đến thư viện ảnh trong máy bạn."
    },
    "Giữ nguyên logic chọn file/native file picker hiện có."
  ),
  "button-009": createButtonAsset(
    "button-009",
    "Nút quay trở lại",
    "navigation/back",
    "Khi nhấn vào thì nút quay trở về trang trước hoặc trang home.",
    {
      default: "button-009.png",
      click: "Quay trở về trang trước hoặc trang home."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-010": createButtonAsset(
    "button-010",
    "Nút restart",
    "action",
    "Nút để scan lại lần nữa.",
    {
      default: "button-010.png",
      click: "Scan lại lần nữa."
    },
    "Giữ nguyên logic scan lại hiện có."
  ),
  "button-011": createButtonAsset(
    "button-011",
    "Nút hoàn tất",
    "action",
    "Sau khi hoàn thành lựa món hoặc lựa nguyên liệu thì nhấn.",
    {
      default: "button-011.png",
      click: "Hoàn thành lựa món hoặc lựa nguyên liệu."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-012": createButtonAsset(
    "button-012",
    "Nút thêm số người",
    "quantity-control",
    "Dùng để chỉnh sửa số người ăn.",
    {
      default: "button-012.png",
      click: "Chỉnh sửa số người ăn."
    },
    "Giữ nguyên logic tăng/giảm số người ăn hiện có."
  ),
  "button-013": createButtonAsset(
    "button-013",
    "Nút công tắc dị ứng",
    "state-toggle",
    "Bật lên nếu bạn dị ứng.",
    {
      default: "button-013.png",
      active: "Bật lên nếu bạn dị ứng."
    },
    "Giữ nguyên logic bật/tắt dị ứng hiện có."
  ),
  "button-014": createButtonAsset(
    "button-014",
    "Nút xác nhận",
    "action",
    "Xác nhận điều chỉnh nhu cầu trong chọn lọc khi dùng function nhập món ăn.",
    {
      default: "button-014.png",
      click: "Xác nhận điều chỉnh nhu cầu trong chọn lọc khi dùng function nhập món ăn."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-015": createButtonAsset(
    "button-015",
    "Nút rác",
    "delete-action",
    "Nhấn khi muốn xóa nguyên liệu.",
    {
      default: "button-015.png",
      click: "Xóa nguyên liệu."
    },
    "Giữ nguyên logic xóa hiện có."
  ),
  "button-016": createButtonAsset(
    "button-016",
    "Nút thêm số lượng",
    "quantity-control",
    "Nhấn khi muốn gia giảm số lượng nguyên liệu đó.",
    {
      default: "button-016.png",
      click: "Gia giảm số lượng nguyên liệu đó."
    },
    "Giữ nguyên logic tăng/giảm số lượng nguyên liệu hiện có."
  ),
  "button-017": createButtonAsset(
    "button-017",
    "Nút thanh toán",
    "checkout-action",
    "Nhấn khi chốt thanh toán order.",
    {
      default: "button-017.png",
      click: "Chốt thanh toán order."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-018": createButtonAsset(
    "button-018",
    "Nút ở đây",
    "navigation/detail",
    "Dùng để kiểm tra lại chi tiết đơn món đã thanh toán.",
    {
      default: "button-018.png",
      click: "Kiểm tra lại chi tiết đơn món đã thanh toán."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-019": createButtonAsset(
    "button-019",
    "Nút hủy đặt đơn",
    "cancel-action",
    "Muốn hủy đặt đơn thì nhấn.",
    {
      default: "button-019.png",
      click: "Hủy đặt đơn."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-020": createButtonAsset(
    "button-020",
    "Nút hướng dẫn",
    "navigation/detail",
    "Nhấn để xem lại cách hướng dẫn nấu ăn cho món đã chọn.",
    {
      default: "button-020.png",
      click: "Xem lại cách hướng dẫn nấu ăn cho món đã chọn."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-021": createButtonAsset(
    "button-021",
    "Nút giỏ hàng",
    "navigation",
    "Khi nhấn vào thì nút dẫn đến trang giỏ hàng.",
    {
      default: "button-021.png",
      click: "Dẫn đến trang giỏ hàng."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-022": createButtonAsset(
    "button-022",
    "Nút mua hàng",
    "checkout-action",
    "Sau khi đã chọn các món muốn thanh toán ngay thì nhấn.",
    {
      default: "button-022.png",
      click: "Mua hàng sau khi đã chọn các món muốn thanh toán ngay."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-023": createButtonAsset(
    "button-023",
    "Nút hồ sơ",
    "navigation",
    "Nhấn vào để sang trang cài đặt và trang hồ sơ mascot.",
    {
      default: "button-023.png",
      click: "Sang trang cài đặt và trang hồ sơ mascot."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-024": createButtonAsset(
    "button-024",
    "Nút membership",
    "navigation/membership",
    "Để hưởng các quyền lợi của membership.",
    {
      default: "button-024.png",
      click: "Hưởng các quyền lợi của membership."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-025": createButtonAsset(
    "button-025",
    "Nút chọn lọc",
    "filter-action",
    "Để điều chỉnh giá tiền, review và các yêu cầu khác khi mua sắm các nguyên liệu.",
    {
      default: "button-025.png",
      click: "Điều chỉnh giá tiền, review và các yêu cầu khác khi mua sắm các nguyên liệu."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-026": createButtonAsset(
    "button-026",
    "Nút không",
    "cancel-action",
    "Hủy khi không muốn xác nhận một hành động.",
    {
      default: "button-026.png",
      click: "Hủy khi không muốn xác nhận một hành động."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  ),
  "button-027": createButtonAsset(
    "button-027",
    "Nút xác nhận",
    "confirm-action",
    "Xác nhận một hành động.",
    {
      default: "button-027.png",
      click: "Xác nhận một hành động."
    },
    "Chỉ dùng Product ID để map đúng ảnh PNG và không thay đổi logic không liên quan."
  )
};

export const buttonAssetList = Object.values(buttonAssets);

export function getButtonAsset(buttonId: ButtonId) {
  return buttonAssets[buttonId];
}
