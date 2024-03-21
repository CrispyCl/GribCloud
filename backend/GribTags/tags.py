from collections import Counter

import torchvision
from torchvision import transforms


def non_maximum_suppression(items, val_limit=0.92):
    return list(filter(lambda x: x[2].item() > val_limit, items))


class Identificator:
    def __init__(self):
        self.model = torchvision.models.detection.fasterrcnn_resnet50_fpn(weights=True)

    def identify(self, pre_img):
        self.model.eval()
        k = transforms.Compose([transforms.ToTensor()])
        img = k(pre_img)
        img = img.unsqueeze(dim=0)

        pred = self.model(img)

        items = zip(pred[0]["boxes"], pred[0]["labels"], pred[0]["scores"])
        items = non_maximum_suppression(items)
        k = Counter()
        for i in items:
            i = COCO_INSTANCE_CATEGORY_NAMES[i[1]]
            if isinstance(i, list):
                for j in i:
                    k[j] += 1
            elif i != "N/A":
                k[i] += 1
        return k


COCO_INSTANCE_CATEGORY_NAMES = [
    "background",
    "Люди",
    "Велосипед",
    "Автомобили",
    "Мотоциклы",
    "Самалёты",
    "Автобусы",  # 1
    "Поезда",
    "Грузовики",
    "Лодка",
    "Дороги",
    "Гидрант",
    "N/A",
    "Дороги",  # 2
    "Парковочный счетчик",
    "Скамейка",
    "Птицы",
    "Коты",
    "Собаки",
    "Лошади",
    "Овцы",
    "Коровы",  # 3
    "Слоны",
    "Медведи",
    "Зебры",
    "Жирафы",
    "N/A",
    "Рюкзак",
    "Зонт",
    "N/A",
    "N/A",  # 4
    "Сумка",
    "Галстук",
    "Чемодан",
    "Фрисби",
    ["Лыжи", "Спорт"],
    ["Сноуборд", "Спорт"],
    "Спорт",  # 5
    "Воздушный змей",
    "Бита",
    ["Бейсбольная перчатка", "Спорт"],
    "Скейтбординг",
    ["Сёрфинг", "Спорт"],
    ["Теннис", "Спорт"],  # 6
    "Напитки",
    "N/A",
    ["Вино", "Напитки"],
    ["Кружка", "Перекус"],
    "Перекус",
    "Кухня",
    "Перекус",
    "Кухня",  # 7
    "Фрукты",
    "Фрукты",
    "Перекус",
    "Фрукты",
    "Овощи",
    "Овощи",
    "Перекус",
    ["Пицца", "Перекус"],  # 8
    ["Десерт", "Перекус"],
    ["Десерт", "Перекус"],
    "Мебель",
    "Мебель",
    "Растеневодство",
    "Спальня",
    "N/A",
    ["Кухня", "Мебель"],  # 9
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "Техника",
    "Техника",
    "Техника",
    "remote",
    "Техника",
    "Телефон",  # 10
    "Кухня",
    "Кухня",
    "Кухня",
    "Кухня",
    "Кухня",
    "N/A",
    "Книги",  # 11
    "Часы",
    "Интерьер",
    "Канцтовары",
    "Игрушки",
    "Гигиена",
    "Гигиена",  # 12
]
