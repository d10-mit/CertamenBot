def common(lists):
    if not lists:
        return 0
    commons = list(lists[0])
    for l in lists:
        uncommons = []
        for element in commons:
            if element not in l:
                uncommons.append(element)
        for element in uncommons:
            commons.remove(element)
    return len(commons)